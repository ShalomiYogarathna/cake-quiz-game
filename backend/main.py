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
                "image": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=300&q=80",
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
                "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 3,
                "image": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=300&q=80",
                "correct": False
            },
            {
                "id": 4,
                "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
                "correct": False
            }
        ]
    }
