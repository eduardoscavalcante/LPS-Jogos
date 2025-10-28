let cartas = [];
let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;
let totalPares = 0;

let temaMemory = "filmes";
let dificuldadeMemory = "facil";

const temas = {
    filmes: ["Titanic","Matrix","Coringa","Avatar","Star Wars","Jurassic Park","Inception","Shrek"],
    geografia: ["Brasil","China","Egito","Austrália","Canadá","Itália","Japão","Espanha"],
    historia: ["Egito","Roma","Napoleão","Guerra","Revolução","Império","Cavaleiro","Renascença"],
    tecnologia: ["Python","HTML","JavaScript","API","Banco","IA","Computador","Robô"]
};

function iniciarMemory(dificuldade=dificuldadeMemory) {
    dificuldadeMemory = dificuldade;

    let pares = 4;
    if(dificuldade==="medio") pares=6;
    if(dificuldade==="dificil") pares=8;
    totalPares = pares;

    let cartasTema = temas[temaMemory].slice(0, pares);
    cartas = shuffle([...cartasTema, ...cartasTema]);

    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;
    paresEncontrados = 0;

    document.getElementById("memory-dificuldade").style.display = "none";
    document.getElementById("memory-game").style.display = "block";

    renderizarTabuleiro();
    atualizarPontuacao();
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
    if(bloqueado || div.classList.contains("aberta")) return;

    div.classList.add("aberta");
    div.textContent = cartas[index];

    if(!primeiraCarta) {
        primeiraCarta = {div, index};
    } else {
        segundaCarta = {div, index};
        bloqueado = true;

        if(cartas[primeiraCarta.index] === cartas[segundaCarta.index]) {
            paresEncontrados++;
            setTimeout(() => {
                primeiraCarta.div.style.backgroundColor = "#28a745";
                segundaCarta.div.style.backgroundColor = "#28a745";
                resetCartas();
                if(paresEncontrados === totalPares) fimMemory();
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

function shuffle(array) {
    for(let i = array.length - 1; i > 0; i--){
        let j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
