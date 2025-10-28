let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;
let totalPares = 0;

let temaMemory = "filmes";
let dificuldadeMemory = "facil";

const API_BASE = "https://quiz-lps.onrender.com";

// Seleciona tema do Memory
function selecionarMemoryTema(tema) {
    temaMemory = tema;
    document.getElementById("memory-menu").style.display = "none";
    document.getElementById("memory-dificuldade").style.display = "block";
}

// Inicia Memory consumindo a API do microservice
async function iniciarMemory(dificuldade = dificuldadeMemory) {
    dificuldadeMemory = dificuldade;

    try {
        const response = await fetch(`${API_BASE}/memory/${temaMemory}/${dificuldade}`);
        const data = await response.json();

        cartas = data.cartas;
        totalPares = data.pares_total;

        primeiraCarta = null;
        segundaCarta = null;
        bloqueado = false;
        paresEncontrados = 0;

        document.getElementById("memory-dificuldade").style.display = "none";
        document.getElementById("memory-game").style.display = "block";

        renderizarTabuleiro();
        atualizarPontuacao();
    } catch (err) {
        alert("Erro ao carregar o Memory Game. Verifique o microservice.");
        console.error(err);
    }
}

function renderizarTabuleiro() {
    const tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";

    cartas.forEach((carta, i) => {
        const div = document.createElement("div");
        div.classList.add("carta");
        div.dataset.index = i;
        div.textContent = "";
        div.onclick = () => virarCarta(div, i);
        tabuleiro.appendChild(div);
    });
}

async function virarCarta(div, index) {
    if (bloqueado || div.classList.contains("aberta")) return;

    div.classList.add("aberta");
    div.textContent = cartas[index];

    if (!primeiraCarta) {
        primeiraCarta = { div, index };
    } else {
        segundaCarta = { div, index };
        bloqueado = true;

        if (cartas[primeiraCarta.index] === cartas[segundaCarta.index]) {
            paresEncontrados++;

            // Pontuação por par:
            const usuario_id = localStorage.getItem("usuario_id") || "anonimo";
            let pontos = 1;
            if (dificuldadeMemory === "medio") pontos = 2;
            else if (dificuldadeMemory === "dificil") pontos = 3;

            try {
                await fetch(`${API_BASE}/pontuacao/${usuario_id}/${pontos}`, {
                    method: "POST"
                });

                if (typeof buscarPontuacaoTotal === "function") {
                    buscarPontuacaoTotal();
                }
            } catch (err) {
                console.error("Erro ao registrar pontos:", err);
            }

            setTimeout(() => {
                primeiraCarta.div.style.backgroundColor = "#28a745";
                segundaCarta.div.style.backgroundColor = "#28a745";
                resetCartas();
                if (paresEncontrados === totalPares) fimMemory();
            }, 500);

        } else {
            setTimeout(() => {
                primeiraCarta.div.classList.remove("aberta");
                segundaCarta.div.classList.remove("aberta");
                primeiraCarta.div.textContent = "";
                segundaCarta.div.textContent = "";
                resetCartas();
            }, 800);
        }
    }
}


function resetCartas() {
    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;
    atualizarPontuacao();
}

async function fimMemory() {
    await registrarPontosBackend();
    setTimeout(() => {
        alert(`Parabéns! Você encontrou todos os pares!`);
    }, 300);
}

// ✅ Apenas adicionamos o sistema de pontos
async function registrarPontosBackend() {
    try {
        await fetch(`${API_BASE}/pontos/memory`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });
        if (typeof buscarPontuacaoTotal === "function") {
            buscarPontuacaoTotal();
        }
    } catch (err) {
        console.error("Erro ao registrar pontos:", err);
    }
}

function atualizarPontuacao() {
    document.getElementById("pontuacaoMemory").textContent = 
        `Pares encontrados: ${paresEncontrados} / ${totalPares}`;
}
