import random
import secrets
from typing import Optional

import requests
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


USERS = {}
TOKENS = {}

CAKE_QUESTIONS = [
    {
        "question": "Which image shows a chocolate cake?",
        "answers": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80",
                "correct": True,
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
        ],
    },
    {
        "question": "Which image shows cupcakes?",
        "answers": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=300&q=80",
                "correct": True,
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
        ],
    },
    {
        "question": "Which image shows macarons?",
        "answers": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=300&q=80",
                "correct": True,
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=300&q=80",
                "correct": False,
            },
        ],
    },
]


def get_current_user(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "", 1)
    email = TOKENS.get(token)

    if not email or email not in USERS:
        raise HTTPException(status_code=401, detail="Invalid token")

    return USERS[email]


@app.get("/")
def home():
    return {"message": "Cake Shop Banana Challenge API is running"}


@app.post("/register")
def register_user(payload: RegisterRequest):
    if payload.email in USERS:
        raise HTTPException(status_code=400, detail="Email already registered")

    USERS[payload.email] = {
        "username": payload.username,
        "email": payload.email,
        "password": payload.password,
    }

    return {"message": "Registration successful"}


@app.post("/login")
def login_user(payload: LoginRequest):
    user = USERS.get(payload.email)

    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = secrets.token_hex(16)
    TOKENS[token] = payload.email

    return {
        "token": token,
        "username": user["username"],
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
    response = requests.get("https://marcconrad.com/uob/banana/api.php", timeout=10)
    response.raise_for_status()
    return response.json()


@app.get("/cake-question/random")
def get_random_cake_question(authorization: Optional[str] = Header(default=None)):
    get_current_user(authorization)
    return random.choice(CAKE_QUESTIONS)
