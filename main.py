from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

# Habilitar CORS para comunicação com front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def carregar_perguntas(tema):
    arquivo = os.path.join(BASE_DIR, "data", f"{tema}.json")
    if not os.path.exists(arquivo):
        raise HTTPException(status_code=404, detail="Tema não encontrado")
    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)

@app.get("/")
def root():
    return {"message": "API de Quiz funcionando!"}

@app.get("/perguntas/{tema}")
def obter_perguntas(tema: str):
    return carregar_perguntas(tema)
