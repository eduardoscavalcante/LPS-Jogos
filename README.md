# LPS Jogos Não Violentos

## Descrição

Este projeto é uma **Linha de Produto de Software (LPS) para Jogos não violentos**, utilizando **Componentes de Software** e **Microservices**.  

Atualmente, o sistema inclui três jogos:

- **Quiz**: perguntas de múltipla escolha sobre diversos temas.  
- **Memory Game**: jogo da memória com cartas temáticas e níveis de dificuldade.  
- **Soletra**: jogo de formação de palavras usando letras disponíveis, com dificuldade configurável.  

Todos os jogos compartilham:

- **Usuário único** (UUID armazenado no navegador)  
- **Pontuação global unificada**, persistida via microservice.  

O backend é implementado com **FastAPI**, e os front-ends são em **HTML/JS/CSS**, consumindo o mesmo microservice para dados e pontuação.

---

## Funcionalidades

### Jogos

- **Quiz**:  
  - Seleção de tema (Geografia, Filmes, História, Tecnologia)  
  - Embaralhamento de perguntas e alternativas  
  - Pontuação por acerto  

- **Memory Game**:  
  - Seleção de tema e dificuldade (Fácil, Médio, Difícil)  
  - Cartas embaralhadas  
  - Pontuação incrementada a cada par correto  

- **Soletra**:  
  - Seleção de dificuldade  
  - Entrada por teclado ou clique  
  - Pontuação por palavra encontrada (1 ponto normal, 2 pontos para pangrama)  

### Sistema de Pontuação

- Pontuação unificada para todos os jogos  
- Persistência via microservice (`/pontuacao/{usuarioId}/{pontos}`)  
- Pontuação global exibida em tempo real  

### Microservice

Endpoints disponíveis:

- `GET /quiz/{tema}` → retorna perguntas do Quiz  
- `GET /memory/{tema}/{dificuldade}` → retorna cartas do Memory Game  
- `GET /pontuacao/{usuarioId}` → retorna pontuação atual do usuário  
- `POST /pontuacao/{usuarioId}/{pontos}` → adiciona pontos ao usuário  


---

## Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript  
- **Backend / Microservice**: Python, FastAPI  
- **Banco de dados**: JSON (para pontuação e perguntas/cartas)  
- **Hospedagem**: Render / local  

---

## Como Executar

1. Clonar o projeto:
git clone https://github.com/seu-usuario/lps-jogos.git
cd lps-jogos

2. Instalar dependências:
pip install fastapi uvicorn

3. Rodar o microservice:
uvicorn main:app --reload

4. Abrir index.html no navegador e começar a jogar.

O frontend consome automaticamente o microservice para pontuação e dados dos jogos.

https://eduardoscavalcante.github.io/LPS-Jogos/front/index.html

## Estrutura de Pontuação
Usuário identificado por UUID único (usuarioId)
Pontos adicionados para cada acerto no Quiz, Memory ou Soletra
Pontuação global exibida no topo da interface
