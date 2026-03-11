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
