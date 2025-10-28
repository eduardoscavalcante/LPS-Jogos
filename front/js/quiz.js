let perguntas = [];
let indice = 0;
let pontos = 0;
let temaAtual = "";
let dificuldadeAtual = "todos";

function selecionarTema(tema) {
    temaAtual = tema;
    document.getElementById("quiz-menu").style.display = "none";
    document.getElementById("dificuldade").style.display = "block";
}

async function iniciarQuiz(dificuldade) {
    dificuldadeAtual = dificuldade;
    const response = await fetch(`https://quiz-lps.onrender.com/quiz/${temaAtual}`);
    let data = await response.json();

    // filtra por dificuldade
    perguntas = data.filter(q => dificuldade === "todos" || q.dificuldade === dificuldade);

    indice = 0;
    pontos = 0;

    document.getElementById("dificuldade").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("resultadoFinal").style.display = "none";

    document.getElementById("tema-titulo").textContent = temaAtual.charAt(0).toUpperCase() + temaAtual.slice(1);

    mostrarPergunta();
}

function mostrarPergunta() {
    if (indice >= perguntas.length) {
        finalizarQuiz();
        return;
    }

    const atual = perguntas[indice];
    document.getElementById("pergunta").textContent = atual.pergunta;
    document.getElementById("btn-proxima").style.display = "none";

    const altDiv = document.getElementById("alternativas");
    altDiv.innerHTML = "";

    atual.alternativas.forEach((alt, i) => {
        const btn = document.createElement("button");
        btn.textContent = alt;
        btn.onclick = () => verificarResposta(i, btn);
        altDiv.appendChild(btn);
    });

    const barra = document.getElementById("barra-progresso");
    barra.style.width = `${(indice / perguntas.length) * 100}%`;
}

function verificarResposta(resp, botao) {
    const atual = perguntas[indice];
    const botoes = document.querySelectorAll("#alternativas button");

    botoes.forEach(b => b.disabled = true);
    botoes.forEach(b => b.classList.remove("correct", "wrong"));

    if (resp === atual.correta) {
        pontos++;
        botao.classList.add("correct");
        // Adiciona ponto global
        if (typeof adicionarPontos === "function") {
            adicionarPontos(1);
        }
    } else {
        botao.classList.add("wrong");
        botoes[atual.correta].classList.add("correct");
    }

    document.getElementById("btn-proxima").style.display = "block";
}

function proximaPergunta() {
    indice++;
    mostrarPergunta();
}

function finalizarQuiz() {
    document.getElementById("quiz").style.display = "none";
    document.getElementById("resultadoFinal").style.display = "block";
    document.getElementById("pontuacao").textContent = `Você acertou ${pontos} de ${perguntas.length}!`;
}

function voltarMenu() {
    document.getElementById("menu").style.display = "block";
    document.getElementById("quiz-menu").style.display = "none";
    document.getElementById("dificuldade").style.display = "none";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("resultadoFinal").style.display = "none";
    document.getElementById("tema-titulo").textContent = "LPS Jogos";
}
