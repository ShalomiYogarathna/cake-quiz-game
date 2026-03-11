from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Cake Quiz API is running"}


@app.get("/banana")
def get_banana_question():
    response = requests.get("https://marcconrad.com/uob/banana/api.php")
    return response.json()

@app.get("/cake-question")
def get_cake_question():
    return {
        "question": "Which image shows a chocolate cake?",
        "answers": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=300&q=80",
                "correct": True
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=300&q=80",
                "correct": False
            }
        ]
    }

@app.get("/cake-question-2")
def get_cake_question_2():
    return {
        "question": "Which image shows cupcakes?",
        "answers": [
            {
                "id": 1,
                "image": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=300&q=80",
                "correct": True
            },
            {
                "id": 2,
                "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=300&q=80",
                "correct": False
            }
        ]
    }


