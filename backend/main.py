import random
import re
from typing import Optional

import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from pydantic import BaseModel
from starlette.middleware.sessions import SessionMiddleware
=======
from starlette.middleware.sessions import SessionMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator, model_validator
from fastapi import Request
>>>>>>> codex/refactor-auth-modularity
from database import (
    create_scores_table,
    create_user,
    create_users_table,
    get_score_summary_by_user,
    get_scores_by_user,
    get_user_by_email,
    save_score,
<<<<<<< Updated upstream
    save_token,
=======
    update_user_password,
>>>>>>> Stashed changes
)

app = FastAPI()
create_users_table()
create_scores_table()

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

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        normalized_value = value.strip()

        if not re.fullmatch(r"[A-Za-z0-9_ ]{3,20}", normalized_value):
            raise ValueError(USERNAME_RULE_TEXT)

        return normalized_value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized_value = value.strip().lower()

        if not re.fullmatch(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", normalized_value):
            raise ValueError(EMAIL_RULE_TEXT)

        return normalized_value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not is_strong_password(value):
            raise ValueError(PASSWORD_RULE_TEXT)

        return value


class LoginRequest(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        normalized_value = value.strip().lower()

        if not re.fullmatch(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", normalized_value):
            raise ValueError(EMAIL_RULE_TEXT)

        return normalized_value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        normalized_value = value.strip()

        if not normalized_value:
            raise ValueError("Password is required.")

        return value

class ScoreRequest(BaseModel):
    score: int
    total_questions: int

<<<<<<< HEAD
=======
    @model_validator(mode="after")
    def validate_scores(self):
        if self.total_questions <= 0:
            raise ValueError("Total questions must be greater than 0.")

        if self.score < 0:
            raise ValueError("Score cannot be negative.")

        if self.score > self.total_questions:
            raise ValueError("Score cannot be greater than total questions.")

        return self

USERS = {}
TOKENS = {}

>>>>>>> codex/refactor-auth-modularity
MEALDB_DESSERTS_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert"
NUMBERS_API_URL = "http://numbersapi.com/{number}?json"
PASSWORD_RULE_TEXT = (
    "Password must be at least 8 characters and include an uppercase letter, "
    "a lowercase letter, a number, and a special character."
)
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
=======
USERNAME_RULE_TEXT = (
    "Username must be 3-20 characters and use only letters, numbers, spaces, or underscores."
)
EMAIL_RULE_TEXT = "Enter a valid email address."
>>>>>>> codex/refactor-auth-modularity
PASSWORD_HASH_PREFIX = "pbkdf2_sha256"
EMAIL_RULE_TEXT = "Enter a valid email address."
USERNAME_RULE_TEXT = (
    "Username must be 3-20 characters and use only letters, numbers, spaces, underscores, or hyphens."
)
BANANA_FALLBACK_QUESTION = {
    "question": "https://marcconrad.com/uob/banana/example.png",
    "solution": 6,
    "source": "Local fallback",
}
FALLBACK_DESSERTS = [
    {
        "idMeal": "fallback-1",
        "strMeal": "Chocolate Cake",
        "strMealThumb": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
    },
    {
        "idMeal": "fallback-2",
        "strMeal": "Strawberry Tart",
        "strMealThumb": "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80",
    },
    {
        "idMeal": "fallback-3",
        "strMeal": "Cupcake",
        "strMealThumb": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
    },
    {
        "idMeal": "fallback-4",
        "strMeal": "Lemon Cheesecake",
        "strMealThumb": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80",
    },
]
>>>>>>> Stashed changes


def is_strong_password(password: str) -> bool:
    return bool(
        len(password) >= 8
        and re.search(r"[A-Z]", password)
        and re.search(r"[a-z]", password)
        and re.search(r"\d", password)
        and re.search(r"[^A-Za-z0-9]", password)
    )


<<<<<<< HEAD
<<<<<<< Updated upstream
def get_current_user(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "", 1)
    email = TOKENS.get(token) or get_email_by_token(token)

=======
def is_valid_email(email: str) -> bool:
    return bool(re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email.strip()))


def is_valid_username(username: str) -> bool:
    cleaned_username = username.strip()
    return bool(
        3 <= len(cleaned_username) <= 20
        and re.fullmatch(r"[A-Za-z0-9 _-]+", cleaned_username)
    )
=======
@app.exception_handler(RequestValidationError)
async def handle_validation_error(request: Request, exc: RequestValidationError):
    first_error = exc.errors()[0] if exc.errors() else None

    if first_error:
        message = first_error.get("msg", "Invalid request data.")
        if message.startswith("Value error, "):
            message = message.replace("Value error, ", "", 1)
    else:
        message = "Invalid request data."

    return JSONResponse(status_code=422, content={"detail": message})
>>>>>>> codex/refactor-auth-modularity


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


def get_current_user(request: Request):
    email = request.session.get("user_email")
>>>>>>> Stashed changes

    if not email:
        raise HTTPException(status_code=401, detail="No active session")

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
    username = payload.username.strip()
    email = payload.email.strip().lower()

    if not is_valid_username(username):
        raise HTTPException(status_code=400, detail=USERNAME_RULE_TEXT)

    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail=EMAIL_RULE_TEXT)

    existing_user = get_user_by_email(email)

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

<<<<<<< HEAD
    if not is_strong_password(payload.password):
        raise HTTPException(status_code=400, detail=PASSWORD_RULE_TEXT)

<<<<<<< Updated upstream
    create_user(payload.username, payload.email, payload.password)
=======
    create_user(username, email, hash_password(payload.password))
>>>>>>> Stashed changes
=======
    create_user(payload.username, payload.email, hash_password(payload.password))
>>>>>>> codex/refactor-auth-modularity

    return {"message": "Registration successful"}

@app.post("/login")
def login_user(payload: LoginRequest, request: Request):
    email = payload.email.strip().lower()

    if not is_valid_email(email):
        raise HTTPException(status_code=400, detail=EMAIL_RULE_TEXT)

    user = get_user_by_email(email)

    if not user or user[3] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

<<<<<<< Updated upstream
    token = secrets.token_hex(16)
    TOKENS[token] = payload.email
    save_token(token, payload.email)
    request.session["user_email"] = payload.email
=======
    if not user[3].startswith(f"{PASSWORD_HASH_PREFIX}$"):
        update_user_password(email, hash_password(payload.password))

    request.session["user_email"] = email
>>>>>>> Stashed changes


    return {
        "username": user[1],
        "email": user[2],
    }


@app.get("/me")
def get_me(request: Request):
    user = get_current_user(request)
    return {
        "username": user["username"],
        "email": user["email"],
    }


@app.get("/banana")
<<<<<<< Updated upstream
def get_banana_question(authorization: Optional[str] = Header(default=None)):
    get_current_user(authorization)
    response = requests.get("https://marcconrad.com/uob/banana/api.php", timeout=10)
    response.raise_for_status()
    return response.json()
=======
def get_banana_question(request: Request):
    get_current_user(request)
    # External interoperability source: University of Bedfordshire Banana API.
    try:
        response = requests.get("https://marcconrad.com/uob/banana/api.php", timeout=10)
        response.raise_for_status()
        data = response.json()
        data["source"] = "Banana API"
        return data
    except requests.RequestException:
        return BANANA_FALLBACK_QUESTION
>>>>>>> Stashed changes


@app.get("/dessert-question/random")
def get_random_dessert_question(request: Request):
    get_current_user(request)

<<<<<<< Updated upstream
    response = requests.get(MEALDB_DESSERTS_URL, timeout=10)
    response.raise_for_status()
    meals = response.json().get("meals") or []
=======
    # External interoperability source: TheMealDB dessert catalog API.
    try:
        response = requests.get(MEALDB_DESSERTS_URL, timeout=10)
        response.raise_for_status()
        meals = response.json().get("meals") or []
        source = "TheMealDB"
    except requests.RequestException:
        meals = FALLBACK_DESSERTS
        source = "Local fallback"
>>>>>>> Stashed changes

    if len(meals) < 4:
        meals = FALLBACK_DESSERTS
        source = "Local fallback"

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
        "source": source,
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
    request: Request,
):
    user = get_current_user(request)

    if payload.score < 0 or payload.total_questions <= 0 or payload.score > payload.total_questions:
        raise HTTPException(status_code=400, detail="Score data is invalid.")

    save_score(user["id"], payload.score, payload.total_questions)

    return {"message": "Score saved successfully"}

@app.get("/scores")
def read_scores(request: Request):
    user = get_current_user(request)
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
def read_dashboard(request: Request):
    user = get_current_user(request)
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
def get_number_fact(number: int, request: Request):
    get_current_user(request)

    try:
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
def logout_user(request: Request):
    request.session.clear()
    return {"message": "Logged out successfully"}
