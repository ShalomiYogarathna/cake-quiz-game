from fastapi import FastAPI
import requests

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Cake Quiz API is running"}


@app.get("/banana")
def get_banana_question():
    response = requests.get("https://marcconrad.com/uob/banana/api.php")
    return response.json()
