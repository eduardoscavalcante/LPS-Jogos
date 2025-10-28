from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import random
import copy

app = FastAPI()

# Habilitar CORS para comunicação com front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -------------------- Configurações --------------------
TEMAS_QUIZ = ["filmes", "geografia", "historia", "tecnologia"]
TEMAS_MEMORY = ["filmes", "geografia", "historia", "tecnologia"]

PONTOS_FILE = os.path.join(BASE_DIR, "data", "pontos.json")

# -------------------- Funções auxiliares --------------------

def carregar_json(arquivo_path: str):
    if not os.path.exists(arquivo_path):
        raise HTTPException(status_code=404, detail=f"Arquivo {arquivo_path} não encontrado")
    with open(arquivo_path, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_json(arquivo_path: str, dados):
    os.makedirs(os.path.dirname(arquivo_path), exist_ok=True)
    with open(arquivo_path, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=4)

def embaralhar_alternativas(pergunta: dict) -> dict:
    alternativas = pergunta["alternativas"]
    correta = pergunta["correta"]
    combinacao = list(enumerate(alternativas))
    random.shuffle(combinacao)
    nova_alternativas = [alt for i, alt in combinacao]
    nova_correta = [i for i, alt in combinacao].index(correta)
    pergunta["alternativas"] = nova_alternativas
    pergunta["correta"] = nova_correta
    return pergunta

def carregar_pontuacao():
    if not os.path.exists(PONTOS_FILE):
        return {}
    with open(PONTOS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def salvar_pontuacao(dados):
    salvar_json(PONTOS_FILE, dados)

# -------------------- Endpoints do Quiz --------------------

@app.get("/")
def root():
    return {"message": "API de Jogos (Quiz e Memory) funcionando!"}

@app.get("/quiz/{tema}")
def quiz_por_tema(tema: str):
    tema = tema.lower()
    if tema not in TEMAS_QUIZ and tema != "todas":
        raise HTTPException(status_code=404, detail=f"Tema '{tema}' não encontrado")
    
    if tema == "todas":
        todas_perguntas = []
        for t in TEMAS_QUIZ:
            perguntas = carregar_json(os.path.join(BASE_DIR, "data", f"{t}.json"))
            todas_perguntas.extend(perguntas)
        selecionadas = random.sample(todas_perguntas, k=min(10, len(todas_perguntas)))
        selecionadas = [embaralhar_alternativas(copy.deepcopy(p)) for p in selecionadas]
        return selecionadas

    perguntas = carregar_json(os.path.join(BASE_DIR, "data", f"{tema}.json"))
    perguntas_embaralhadas = [embaralhar_alternativas(copy.deepcopy(p)) for p in perguntas]
    return perguntas_embaralhadas

# -------------------- Endpoints do Memory --------------------

@app.get("/memory/{tema}/{dificuldade}")
def memory_por_tema_dificuldade(tema: str, dificuldade: str):
    tema = tema.lower()
    dificuldade = dificuldade.lower()
    if tema not in TEMAS_MEMORY:
        raise HTTPException(status_code=404, detail=f"Tema '{tema}' não encontrado")
    
    if dificuldade not in ["facil", "medio", "dificil"]:
        raise HTTPException(status_code=400, detail="Dificuldade inválida. Escolha: facil, medio, dificil")
    
    arquivo = os.path.join(BASE_DIR, "data", "memory", f"{tema}.json")
    memory_data = carregar_json(arquivo)
    
    if dificuldade not in memory_data:
        raise HTTPException(status_code=404, detail=f"Dificuldade '{dificuldade}' não encontrada no tema '{tema}'")
    
    cartas = memory_data[dificuldade]
    cartas_duplicadas = cartas + cartas
    random.shuffle(cartas_duplicadas)
    
    return {"tema": tema, "dificuldade": dificuldade, "cartas": cartas_duplicadas, "pares_total": len(cartas)}

# -------------------- Endpoints de Pontuação --------------------

@app.get("/pontuacao/{usuario_id}")
def obter_pontuacao(usuario_id: str):
    dados = carregar_pontuacao()
    return {"usuario_id": usuario_id, "pontuacao": dados.get(usuario_id, 0)}

@app.post("/pontuacao/{usuario_id}/{pontos}")
def adicionar_pontuacao(usuario_id: str, pontos: int):
    dados = carregar_pontuacao()
    dados[usuario_id] = dados.get(usuario_id, 0) + pontos
    salvar_pontuacao(dados)
    return {"usuario_id": usuario_id, "pontuacao": dados[usuario_id]}

# -------------------- Endpoints extras --------------------

@app.get("/temas/quiz")
def listar_temas_quiz():
    return {"temas": TEMAS_QUIZ}

@app.get("/temas/memory")
def listar_temas_memory():
    return {"temas": TEMAS_MEMORY}
