let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;
let totalPares = 0;

let temaMemory = "filmes";
let dificuldadeMemory = "facil";

// Inicia Memory consumindo a API do microservice
async function iniciarMemory(dificuldade = dificuldadeMemory) {
    dificuldadeMemory = dificuldade;

    try {
        const response = await fetch(`https://quiz-lps.onrender.com/memory/${temaMemory}/${dificuldade}`);
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

function virarCarta(div, index) {
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
            // Adiciona ponto ao mesmo usuário do quiz
            if (typeof adicionarPontos === "function") {
                adicionarPontos(1);
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

function fimMemory() {
    setTimeout(() => {
        alert(`Parabéns! Você encontrou todos os pares!`);
    }, 300);
}

function atualizarPontuacao() {
    document.getElementById("pontuacaoMemory").textContent = `Pares encontrados: ${paresEncontrados} / ${totalPares}`;
}
