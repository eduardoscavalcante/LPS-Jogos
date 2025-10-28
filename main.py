from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import random
import copy

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
TEMAS = ["filmes", "geografia", "historia", "tecnologia"]

def carregar_perguntas(tema):
    arquivo = os.path.join(BASE_DIR, "data", f"{tema}.json")
    if not os.path.exists(arquivo):
        raise HTTPException(status_code=404, detail=f"Tema '{tema}' não encontrado")
    with open(arquivo, "r", encoding="utf-8") as f:
        return json.load(f)

def embaralhar_alternativas(pergunta: dict) -> dict:
    """Embaralha as alternativas e atualiza o índice da correta"""
    alternativas = pergunta["alternativas"]
    correta = pergunta["correta"]

    combinacao = list(enumerate(alternativas))
    random.shuffle(combinacao)

    nova_alternativas = [alt for i, alt in combinacao]
    nova_correta = [i for i, alt in combinacao].index(correta)

    pergunta["alternativas"] = nova_alternativas
    pergunta["correta"] = nova_correta
    return pergunta

@app.get("/")
def root():
    return {"message": "API de Quiz funcionando!"}

@app.get("/perguntas/{tema}")
def obter_perguntas(tema: str):
    if tema == "todas":
        # Carrega todas as perguntas de todos os temas
        todas_perguntas = []
        for t in TEMAS:
            perguntas = carregar_perguntas(t)
            todas_perguntas.extend(perguntas)
        
        # Sortear 10 perguntas aleatórias
        selecionadas = random.sample(todas_perguntas, k=10)
        
        # Embaralha alternativas de cada pergunta
        selecionadas = [embaralhar_alternativas(copy.deepcopy(p)) for p in selecionadas]
        return selecionadas
    
    # Tema específico
    perguntas = carregar_perguntas(tema)
    perguntas_embaralhadas = [embaralhar_alternativas(copy.deepcopy(p)) for p in perguntas]
    return perguntas_embaralhadas
