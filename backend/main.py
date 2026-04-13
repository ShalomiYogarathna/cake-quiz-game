import base64
import hashlib
import hmac
import os
import random
import re
import secrets
from typing import Optional

import requests
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from pydantic import BaseModel
from fastapi import Request
from database import (
    create_scores_table,
    create_tokens_table,
    create_user,
    create_users_table,
    delete_token,
    get_email_by_token,
    get_score_summary_by_user,
    get_scores_by_user,
    get_user_by_email,
    save_score,
    save_token,
    update_user_password,
)

app = FastAPI()
create_users_table()
create_scores_table()
create_tokens_table()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    SessionMiddleware,
    secret_key="cake-shop-secret-key",
)


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str

class ScoreRequest(BaseModel):
    score: int
    total_questions: int

USERS = {}
TOKENS = {}

MEALDB_DESSERTS_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
NUMBERS_API_URL = "http://numbersapi.com/{number}?json"
PASSWORD_RULE_TEXT = (
    "Password must be at least 8 characters and include an uppercase letter, "
    "a lowercase letter, a number, and a special character."
)
PASSWORD_HASH_PREFIX = "pbkdf2_sha256"


def is_strong_password(password: str) -> bool:
    return bool(
        len(password) >= 8
        and re.search(r"[A-Z]", password)
        and re.search(r"[a-z]", password)
        and re.search(r"\d", password)
        and re.search(r"[^A-Za-z0-9]", password)
    )


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 390000)
    encoded_salt = base64.b64encode(salt).decode("utf-8")
    encoded_key = base64.b64encode(derived_key).decode("utf-8")
    return f"{PASSWORD_HASH_PREFIX}${encoded_salt}${encoded_key}"


def verify_password(password: str, stored_password: str) -> bool:
    try:
        algorithm, encoded_salt, encoded_key = stored_password.split("$", 2)
    except ValueError:
        return hmac.compare_digest(stored_password, password)

    if algorithm != PASSWORD_HASH_PREFIX:
        return False

    salt = base64.b64decode(encoded_salt.encode("utf-8"))
    expected_key = base64.b64decode(encoded_key.encode("utf-8"))
    candidate_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 390000)
    return hmac.compare_digest(candidate_key, expected_key)


def get_current_user(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "", 1)
    email = TOKENS.get(token) or get_email_by_token(token)


    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(email)

    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {
        "id": user[0],
        "username": user[1],
        "email": user[2],
    }



@app.get("/")
def home():
    return {"message": "Cake Shop Banana Challenge API is running"}


@app.post("/register")
def register_user(payload: RegisterRequest):
    existing_user = get_user_by_email(payload.email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    if not is_strong_password(payload.password):
        raise HTTPException(status_code=400, detail=PASSWORD_RULE_TEXT)

    create_user(payload.username, payload.email, hash_password(payload.password))

    return {"message": "Registration successful"}

@app.post("/login")
def login_user(payload: LoginRequest, request: Request):
    user = get_user_by_email(payload.email)

    if not user or not verify_password(payload.password, user[3]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user[3].startswith(f"{PASSWORD_HASH_PREFIX}$"):
        update_user_password(payload.email, hash_password(payload.password))

    token = secrets.token_hex(16)
    TOKENS[token] = payload.email
    save_token(token, payload.email)
    request.session["user_email"] = payload.email


    return {
        "token": token,
        "username": user[1],
    }


@app.get("/me")
def get_me(authorization: Optional[str] = Header(default=None)):
    user = get_current_user(authorization)
    return {
        "username": user["username"],
        "email": user["email"],
    }


@app.get("/banana")
def get_banana_question(authorization: Optional[str] = Header(default=None)):
    get_current_user(authorization)
    # External interoperability source: University of Bedfordshire Banana API.
    response = requests.get("https://marcconrad.com/uob/banana/api.php", timeout=10)
    response.raise_for_status()
    return response.json()


@app.get("/dessert-question/random")
def get_random_dessert_question(authorization: Optional[str] = Header(default=None)):
    get_current_user(authorization)

    # External interoperability source: TheMealDB dessert catalog API.
    response = requests.get(MEALDB_DESSERTS_URL, timeout=10)
    response.raise_for_status()
    meals = response.json().get("meals") or []

    if len(meals) < 4:
        raise HTTPException(status_code=502, detail="Not enough dessert options available")

    selected_meals = random.sample(meals, 4)
    correct_meal = random.choice(selected_meals)

    answers = [
        {
            "id": meal["idMeal"],
            "image": meal["strMealThumb"],
            "label": meal["strMeal"],
            "correct": meal["idMeal"] == correct_meal["idMeal"],
        }
        for meal in selected_meals
    ]

    random.shuffle(answers)

    return {
        "question": f"Which dessert image matches {correct_meal['strMeal']}?",
        "answers": answers,
        "source": "TheMealDB",
    }

@app.get("/session-user")
def get_session_user(request: Request):
    user_email = request.session.get("user_email")

    if not user_email:
        raise HTTPException(status_code=401, detail="No active session")

    user = get_user_by_email(user_email)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "username": user[1],
        "email": user[2],
    }

@app.post("/scores")
def create_score(
    payload: ScoreRequest,
    authorization: Optional[str] = Header(default=None),
):
    user = get_current_user(authorization)

    save_score(user["id"], payload.score, payload.total_questions)

    return {"message": "Score saved successfully"}

@app.get("/scores")
def read_scores(authorization: Optional[str] = Header(default=None)):
    user = get_current_user(authorization)
    scores = get_scores_by_user(user["id"])

    return [
        {
            "id": score[0],
            "score": score[1],
            "total_questions": score[2],
            "created_at": score[3],
        }
        for score in scores
    ]


@app.get("/dashboard")
def read_dashboard(authorization: Optional[str] = Header(default=None)):
    user = get_current_user(authorization)
    summary = get_score_summary_by_user(user["id"])
    scores = get_scores_by_user(user["id"])

    latest_score = summary["latest_score"]

    return {
        "username": user["username"],
        "stats": {
            "total_attempts": summary["total_attempts"],
            "best_score": summary["best_score"],
            "average_score": round(summary["average_score"], 2),
            "total_score": summary["total_score"],
            "latest_score": latest_score[0] if latest_score else 0,
            "latest_total_questions": latest_score[1] if latest_score else 0,
            "latest_played_at": latest_score[2] if latest_score else None,
        },
        "history": [
            {
                "id": score[0],
                "score": score[1],
                "total_questions": score[2],
                "created_at": score[3],
            }
            for score in scores
        ],
    }


@app.get("/number-fact/{number}")
def get_number_fact(number: int, authorization: Optional[str] = Header(default=None)):
    get_current_user(authorization)

    try:
        # External interoperability source: Numbers API.
        response = requests.get(NUMBERS_API_URL.format(number=number), timeout=10)
        response.raise_for_status()
        data = response.json()
        return {
            "number": data.get("number", number),
            "text": data.get("text", f"{number} is your sweet challenge score."),
        }
    except requests.RequestException:
        return {
            "number": number,
            "text": f"{number} is your sweet challenge score.",
        }

@app.post("/logout")
def logout_user(
    request: Request,
    authorization: Optional[str] = Header(default=None),
):
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "", 1)
        TOKENS.pop(token, None)
        delete_token(token)

    request.session.clear()
    return {"message": "Logged out successfully"}
