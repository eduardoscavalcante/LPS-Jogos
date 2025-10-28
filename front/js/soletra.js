// soletra.js - versão completa com dificuldade e entrada por teclado/click, mobile-friendly

// Bancos de palavras por dificuldade
const bancos = {
    facil: {
        letras: ['C','A','M','I','N','H','D'],
        central: 'H',
        palavras: [
            "CHIA","CHAMA","MANHA","MANHÃ","MINHA","ACHADA","AMANHÃ",
            "CANCHA","CHIADA","MANCHA","CHACINA","CHAMADA","DANINHA",
            "INCHADA","MACHADA","MAMINHA","NINHADA","ACANHADA","AMANHADA",
            "ANINHADA","CHINCADA","MANCHADA","CAMINHADA","MACHADADA"
        ]
    },
    medio: {
        letras: ['O','B','R','I','G','A','T'],
        central: 'G',
        palavras: [
            "AGIO","AGIR","AGRO","BAGA","GABO","GAGA","GAGO","GARI",
            "GATA","GATO","GIBI","GIRA","GIRO","GOGO","GORO","GOTA",
            "GOTO","GRAO","IOGA","OGRO","TOGA","AGATA","AGITO","AGORA",
            "BRIGA","GABAR","GAITA","GARBO","GAROA","GARRA","GIBAO",
            "GIRAR","GIRIA","GORAR","GORRO","GRATA","GRATO","GRITO",
            "ORGAO","ORGIA","RIGOR","ROGAR","TRAGO","TRIGO","ABRIGO",
            "AGIOTA","AGITAR","AGRIAO","ARTIGO","BIGATO","BRIGAR","GAIATA",
            "GAIATO","GAROAR","GAROTA","GAROTO","GARRIR","GOIABA","GRITAR",
            "OBRIGA","TOBOGA","TRAGAR","ABRIGAR","AGARRAR","AGIOTAR",
            "AGRARIA","AGRARIO","ARROGAR","BARRIGA","GAROTAR","GARRAIO",
            "GATARIA","IRRIGAR","OBRIGAR","AGAIATAR","AGAROTAR","ARRAIGAR",
            "GABARITO","GABIROBA","GARROTAR","GATARRAO","GOROROBA","GRITARIA",
            "GABATORIO","GIRATORIA","GIRATORIO","ROGATORIA","ROGATORIO",
            "IRRIGATORIO","OBRIGATORIA","OBRIGATORIO"
        ]
    },
    dificil: {
        letras: ['P','E','D','I','A','T','R'],
        central: 'P',
        palavras: [
            "APTA","PAPA","PARA","PATA","PATÊ","PÊRA","PIAR","PÍER","PIPA",
            "PIRA","PITA","PITI","PREÁ","RAPA","RAPÉ","RIPA","TAPA","APEAR",
            "ARPAR","ETAPA","PADRE","PAETÊ","PAPAI","PAPAR","PARAR","PARDA",
            "PARIR","PARTE","PEDIR","PEDRA","PERDA","PIADA","PIRAR","PRAIA",
            "PRATA","PRETA","RAPAR","RIPAR","TAIPA","TAPAR","TAPIR","TRIPA",
            "TRIPÉ","ADEPTA","APARAR","APARTE","APATIA","APIPAR","APITAR",
            "ARPEAR","PAIRAR","PAPADA","PAPAIA","PAPEAR","PARADA","PAREAR",
            "PAREDE","PARIDA","PARTIR","PATADA","PATETA","PÁTRIA","PEDIDA",
            "PEDRAR","PEIDAR","PEITAR","PEPITA","PERDER","PERITA","PIPETA",
            "PIRADA","PIRATA","PIRIRI","PIRITA","PITADA","PITAIA","PREDAR",
            "RAPADA","RÁPIDA","RAPTAR","REPTAR","RIPADA","TAPADA","TAPEAR",
            "TAPERA","TAPETE","TÉPIDA","TREPAR","ADAPTAR","APARADA","APARTAR",
            "APEDRAR","APERTAR","APETITE","APIEDAR","APITADA","ARREPIA",
            "DEPARAR","PADARIA","PADEIRA","PADREAR","PAPEIRA","PAREADA",
            "PARTIDA","PEDRADA","PEITADA","PERDIDA","PEREIRA","PIEDADE",
            "PITEIRA","PRATADA","PRATEAR","RAPTADA","REPARAR","REPETIR",
            "REPTADA","TAPEADA","TERAPIA","TREPADADA","ADAPTADA","APARTADA",
            "APÁTRIDA","APERREAR","APERTADA","APETITAR","ARREPIAR","ATAPETAR",
            "DEPARTIR","DEPREDAR","DERRAPAR","PADIEIRA","PARIDADE","PARREIRA",
            "PARTEIRA","PATARATA","PATETEAR","PEDIATRA","PEDRARIA","PEDREIRA",
            "PIRATEAR","PRADARIA","PRATARIA","PRATEADA","PREPARAR","PRETERIR",
            "RAPADEIRA","READAPTAR","REPARTIDA","REPATRIAR","TREPIDADA",
            "TRIPARTIR","APARADORA","PARAPEITAR","PARTIDÁRIA","PATARATADA",
            "PATARATEAR","PERPETRADA","READAPTADA","REPATRIADA","TREPADEIRA",
            "TRIPARTIDA","TRIPARTITE","APARTIDÁRIA","APERTADEIRA","REPARADEIRA"
        ]
    }
};

// Variáveis globais
let letras = [];
let letraCentral = '';
let palavrasValidas = [];
let palavrasEncontradas = [];
let pontuacao = 0;
let palavraAtual = "";

// Inicializa o jogo com dificuldade selecionada
function gerarJogo(dificuldade) {
    const banco = bancos[dificuldade];
    letras = [...banco.letras];
    letraCentral = banco.central;
    palavrasValidas = banco.palavras.map(p => removerAcentos(p.toUpperCase()));
    palavrasEncontradas = [];
    pontuacao = 0;
    palavraAtual = "";

    renderLetras();
    atualizarInterface();
    atualizarListaPalavras();
}

// Renderiza botões das letras
function renderLetras() {
    const container = document.getElementById('letras-container');
    container.innerHTML = '';

    letras.forEach(l => {
        const btn = document.createElement('button');
        btn.textContent = l;
        btn.classList.add('letra');
        if(l === letraCentral) btn.classList.add('central');
        btn.onclick = () => {
            palavraAtual += l;
            atualizarInterface();
        };
        container.appendChild(btn);
    });

    const shuffleBtn = document.createElement('button');
    shuffleBtn.textContent = "Shuffle";
    shuffleBtn.classList.add('shuffle-btn');
    shuffleBtn.onclick = shuffleLetras;
    container.appendChild(shuffleBtn);
}

// Remove última letra
function removerLetra() {
    palavraAtual = palavraAtual.slice(0, -1);
    atualizarInterface();
}

// Envia palavra digitada ou clicada
function enviarPalavra() {
    const inputRaw = palavraAtual.toUpperCase().trim();
    const input = removerAcentos(inputRaw);
    const mensagem = document.getElementById('mensagem');

    if(input.length === 0) return;

    if(palavrasEncontradas.includes(input)) {
        mensagem.textContent = "Você já encontrou essa palavra!";
        return;
    }

    if(!input.includes(letraCentral)) {
        mensagem.textContent = `A palavra deve conter a letra central: ${letraCentral}`;
        return;
    }

    const conjunto = new Set(letras.map(l => l.toUpperCase()));
    for (let char of input) {
        if (!conjunto.has(char)) {
            mensagem.textContent = "Palavra inválida!";
            return;
        }
    }

    if(!palavrasValidas.includes(input)) {
        mensagem.textContent = "Palavra inválida!";
        return;
    }

    palavrasEncontradas.push(input);
    mensagem.textContent = "Correto!";

    const isPangrama = letras.every(l => input.includes(l));
    pontuacao += isPangrama ? 2 : 1;
    palavraAtual = "";

    atualizarInterface();
    atualizarListaPalavras();
}

// Atualiza interface da palavra atual e pontuação
function atualizarInterface() {
    const inputField = document.getElementById('palavra-input');
    inputField.value = palavraAtual;
    document.getElementById('pontuacaoSoletra').textContent = `Pontuação: ${pontuacao}`;
}

// Atualiza lista visual de palavras encontradas e contador
function atualizarListaPalavras() {
    const container = document.getElementById('palavras-encontradas');
    container.innerHTML = '';
    palavrasEncontradas.forEach(p => {
        const bloco = document.createElement('div');
        bloco.textContent = p;
        bloco.classList.add('palavra-bloco');
        container.appendChild(bloco);
    });

    const restantes = palavrasValidas.length - palavrasEncontradas.length;
    document.getElementById('contador-palavras').textContent = `Palavras restantes: ${restantes}`;
}

// Embaralha letras
function shuffleLetras() {
    for(let i = letras.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letras[i], letras[j]] = [letras[j], letras[i]];
    }
    renderLetras();
}

// Inicia o jogo com dificuldade
function iniciarSoletra(dificuldade) {
    document.getElementById("soletra-menu").style.display = "none";
    document.getElementById("soletra-game").style.display = "block";
    gerarJogo(dificuldade);
}

// Listener para digitar letras e enviar
document.getElementById('palavra-input').addEventListener('keydown', function(e){
    if(e.key === "Backspace") {
        removerLetra();
        e.preventDefault();
    } else if(e.key === "Enter") {
        enviarPalavra();
        e.preventDefault();
    } else if(e.key.length === 1) { // letras e caracteres
        const letra = e.key.toUpperCase();
        if(letras.includes(letra)) {
            palavraAtual += letra;
            atualizarInterface();
        }
        e.preventDefault();
    }
});

// Função para remover acentos
function removerAcentos(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
