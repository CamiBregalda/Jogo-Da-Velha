const celulas = document.querySelectorAll('.celula')
const titulo = document.querySelector('#titulo')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const iniciarBtn = document.querySelector('#iniciarBtn')
const reiniciarBtn = document.querySelector('#reiniciarBtn')

// Inicializando variáveis
let player = null
let jogoPausado = false
let jogoIniciou = false

// Array de campos disponíveis
const celulasDisponiveis = ['', '', '',
                            '', '', '',
                            '', '', '']

// Condições de vitória
const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

// Adiciona evento de clique em cada célula
celulas.forEach((celula, index) => {
    celula.addEventListener('click', () => clicarCelula(celula, index))
})

function clicarCelula(celula, index) {
    if (celula.textContent == '' && !jogoPausado && jogoIniciou) {
        atualizarCelula(celula, index)

        // Caso não haja um vencedor, troca o jogador e é feito uma jogada aleatória
        if (!verificarVencedor()) {
            trocarPlayer()
            realizarJogada()
        }
    }
}

function atualizarCelula(cell, index) {
    cell.textContent = player
    celulasDisponiveis[index] = player
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF'
}

function trocarPlayer() {
    player = (player == 'X') ? 'O' : 'X'
}

function realizarJogada() {
    jogoPausado = true;

    setTimeout(() => {
        let indexEscolhido = -1;

        // 1. Verificar se pode vencer
        for (const [a, b, c] of winConditions) {
            if (celulasDisponiveis[a] == player &&
                celulasDisponiveis[b] == player &&
                celulasDisponiveis[c] == '') {
                indexEscolhido = c;
                break;
            }

            if (celulasDisponiveis[a] == player &&
                celulasDisponiveis[c] == player &&
                celulasDisponiveis[b] == '') {
                indexEscolhido = b;
                break;
            }

            if (celulasDisponiveis[b] == player &&
                celulasDisponiveis[c] == player &&
                celulasDisponiveis[a] == '') {
                indexEscolhido = a;
                break;
            }
        }

        // 2. Bloquear o adversário se ele puder vencer
        if (indexEscolhido === -1) {
            let adversario = player === 'X' ? 'O' : 'X';

            for (const [a, b, c] of winConditions) {
                if (celulasDisponiveis[a] == adversario &&
                    celulasDisponiveis[b] == adversario &&
                    celulasDisponiveis[c] == '') {
                    indexEscolhido = c;
                    break;
                }

                if (celulasDisponiveis[a] == adversario &&
                    celulasDisponiveis[c] == adversario &&
                    celulasDisponiveis[b] == '') {
                    indexEscolhido = b;
                    break;
                }

                if (celulasDisponiveis[b] == adversario &&
                    celulasDisponiveis[c] == adversario &&
                    celulasDisponiveis[a] == '') {
                    indexEscolhido = a;
                    break;
                }
            }
        }

        // 3. Se não houver jogada prioritária, escolher aleatoriamente
        if (indexEscolhido === -1) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * celulasDisponiveis.length);
            } while (celulasDisponiveis[randomIndex] != '');
            indexEscolhido = randomIndex;
        }

        atualizarCelula(celulas[indexEscolhido], indexEscolhido, player);

        if (!verificarVencedor()) {
            trocarPlayer();
            jogoPausado = false;
            return;
        }
        player = player === 'X' ? 'O' : 'X';
    }, 500);
}


function verificarVencedor() {
    for (const [a, b, c] of winConditions) {
        if (celulasDisponiveis[a] == player &&
            celulasDisponiveis[b] == player &&
            celulasDisponiveis[c] == player
        ) {
            declararVencedor([a, b, c])
            return true
        }
    }
    
    if (celulasDisponiveis.every(celula => celula != '')) {
        declararEmpate()
        return true
    }
}

function declararVencedor(indicesDoVencedor) {
    titulo.textContent = `${player} ganhou!`
    jogoPausado = true

    indicesDoVencedor.forEach((index) =>
        celulas[index].style.background = '#2A2343'
    )

    reiniciarBtn.style.visibility = 'visible'
    reiniciarBtn.style.display = 'block';
}

function declararEmpate() {
    titulo.textContent = 'Empate!'
    jogoPausado = true
    reiniciarBtn.style.visibility = 'visible'
    reiniciarBtn.style.display = 'block';
}

function escolherPlayer(playerSelecionado) {
    iniciarBtn.style.visibility = 'visible'
    iniciarBtn.style.display = 'block';
    
    if (!jogoIniciou) {
        player = playerSelecionado

        if (player == 'X') {
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

iniciarBtn.addEventListener('click', () => {
    iniciarBtn.style.display = 'none';
    jogoIniciou = true

    if (player == 'O') {
        trocarPlayer()
        realizarJogada()
    }

    titulo.textContent = 'Sua vez!'
})

reiniciarBtn.addEventListener('click', () => {
    iniciarBtn.style.visibility = 'hidden'
    reiniciarBtn.style.display = 'none';
    celulasDisponiveis.fill('')
    celulas.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
    })
    jogoPausado = false
    jogoIniciou = false
    titulo.textContent = 'Escolha um símbolo'

    xPlayerDisplay.classList.remove('player-active')
    oPlayerDisplay.classList.remove('player-active')
})