// Acessando os elementos HTML
const mainMenu = document.getElementById('main-menu');
const playButton = document.getElementById('play-button');
const playerSelection = document.getElementById('player-selection');
const playerCounts = document.querySelectorAll('.player-count-button');
const playerNamesScreen = document.getElementById('player-names');
const playerInputContainer = document.getElementById('player-input-container');
const startGameButton = document.getElementById('start-game-button');
const gameScreen = document.getElementById('game-screen');
const dayTitle = document.getElementById('day-title');
const gameText = document.getElementById('game-text');
const continueButton = document.getElementById('continue-button');
const monarchProof = document.getElementById('monarch-proof');
const proofItems = document.getElementById('proof-items');
const proofWinnerSpan = document.getElementById('proof-winner');
const continueProofButton = document.getElementById('continue-proof');
const paredaoAnnouncement = document.getElementById('paredao-announcement');
const continueParedaoButton = document.getElementById('continue-paredao');
const paredaoNomineesScreen = document.getElementById('paredao-nominees');
const nominee1Span = document.getElementById('nominee1');
const nominee2Span = document.getElementById('nominee2');
const continueAfterNomineesButton = document.getElementById('continue-after-nominees');
const eliminationAnnouncement = document.getElementById('elimination-announcement');
const revealEliminationButton = document.getElementById('reveal-elimination');
const eliminationResultScreen = document.getElementById('elimination-result');
const eliminatedPlayerSpan = document.getElementById('eliminated-player');
const continueAfterEliminationButton = document.getElementById('continue-after-elimination');
const finalScreen = document.getElementById('final-screen');
const finalTitle = document.getElementById('final-text');
const restartGameButton = document.getElementById('restart-game');

// Variáveis do jogo
let players = [];
let totalPlayers;
let day = 1;
let roundCount = 0;
let proofWinner = null;
let paredao = [];

// Funções para gerenciar as telas
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    screen.classList.remove('hidden');
}

// Lógica principal do jogo
playButton.addEventListener('click', () => {
    showScreen(playerSelection);
});

playerCounts.forEach(button => {
    button.addEventListener('click', (e) => {
        totalPlayers = parseInt(e.target.dataset.players);
        createPlayerNameInputs(totalPlayers);
        showScreen(playerNamesScreen);
    });
});

function createPlayerNameInputs(count) {
    playerInputContainer.innerHTML = '';
    for (let i = 1; i <= count; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nome do Jogador ${i}`;
        input.id = `player-${i}`;
        playerInputContainer.appendChild(input);
    }
}

startGameButton.addEventListener('click', () => {
    players = [];
    for (let i = 1; i <= totalPlayers; i++) {
        const playerName = document.getElementById(`player-${i}`).value || `Jogador ${i}`;
        players.push(playerName);
    }
    day = 1;
    startDay();
});

function startDay() {
    if (players.length <= 2) {
        startFinalRound();
        return;
    }
    dayTitle.textContent = `Dia ${day}`;
    roundCount = 0;
    showScreen(gameScreen);
    nextRound();
}

function startFinalRound() {
    dayTitle.textContent = 'Dia Final';
    showScreen(paredaoNomineesScreen);
    nominee1Span.textContent = players[0];
    nominee2Span.textContent = players[1];
    
    // Na final, a prova não acontece, o jogo vai direto para 4 rodadas e depois para eliminação.
    continueAfterNomineesButton.removeEventListener('click', continueAfterNomineesFinal);
    continueAfterNomineesButton.addEventListener('click', continueAfterNomineesFinal);
}

function continueAfterNomineesFinal() {
    roundCount = 0;
    showScreen(gameScreen);
    nextRoundParedao();
}

function nextRound() {
    if (roundCount < 4) {
        const text = getRandomPhrase();
        gameText.textContent = text;
        roundCount++;
    } else {
        showProofScreen();
    }
}

// As frases que você pode personalizar!
const phrases = [
    "{player1} escondeu o biscoito de {player2}.",
    "{player1} elogiou o novo corte de cabelo de {player2}.",
    "{player1} e {player2} tiveram uma discussão sobre quem lavaria a louça.",
    "{player1} ajudou {player2} a encontrar sua pulseira perdida.",
    "{player1} fez uma piada sobre {player2} durante o café da manhã.",
    "{player1} e {player2} formaram uma aliança para o próximo desafio."
];

// As regras da prova do líder que você pode personalizar!
const proofItemsList = [
    "Usar um chapéu de sol por 5 minutos.",
    "Contar uma piada para todos os jogadores.",
    "Fazer uma pose engraçada para a foto.",
    "Dançar a música favorita da casa.",
    "Imitar um animal por 30 segundos."
];

function getRandomPhrase() {
    const p1 = players[Math.floor(Math.random() * players.length)];
    const p2 = players[Math.floor(Math.random() * players.length)];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    return randomPhrase.replace('{player1}', p1).replace('{player2}', p2);
}

continueButton.addEventListener('click', () => {
    nextRound();
});

function showProofScreen() {
    showScreen(monarchProof);
    proofWinner = players[Math.floor(Math.random() * players.length)];
    proofWinnerSpan.textContent = proofWinner;

    proofItems.innerHTML = '';
    const itemsToShow = [];
    while (itemsToShow.length < 4) {
        const item = proofItemsList[Math.floor(Math.random() * proofItemsList.length)];
        if (!itemsToShow.includes(item)) {
            itemsToShow.push(item);
            const li = document.createElement('li');
            li.textContent = item;
            proofItems.appendChild(li);
        }
    }
}

continueProofButton.addEventListener('click', () => {
    showScreen(paredaoAnnouncement);
});

continueParedaoButton.addEventListener('click', () => {
    nominateForParedao();
});

function nominateForParedao() {
    paredao = [];
    while (paredao.length < 2) {
        const nominee = players[Math.floor(Math.random() * players.length)];
        if (nominee !== proofWinner && !paredao.includes(nominee)) {
            paredao.push(nominee);
        }
    }
    nominee1Span.textContent = paredao[0];
    nominee2Span.textContent = paredao[1];
    showScreen(paredaoNomineesScreen);
}

continueAfterNomineesButton.addEventListener('click', () => {
    roundCount = 0;
    showScreen(gameScreen);
    nextRoundParedao();
});

function nextRoundParedao() {
    if (roundCount < 4) {
        const text = getRandomPhrase();
        gameText.textContent = text;
        roundCount++;
    } else {
        showEliminationScreen();
    }
}

function showEliminationScreen() {
    showScreen(eliminationAnnouncement);
}

revealEliminationButton.addEventListener('click', () => {
    let eliminatedPlayer;
    if (players.length === 2) {
        // Final: um dos dois é eliminado
        eliminatedPlayer = paredao[Math.floor(Math.random() * paredao.length)];
    } else {
        // Paredão normal
        eliminatedPlayer = paredao[Math.floor(Math.random() * paredao.length)];
    }

    eliminatedPlayerSpan.textContent = eliminatedPlayer;
    players = players.filter(player => player !== eliminatedPlayer);
    
    showScreen(eliminationResultScreen);
});

continueAfterEliminationButton.addEventListener('click', () => {
    if (players.length === 1) {
        endGame();
    } else {
        day++;
        startDay();
    }
});

function endGame() {
    showScreen(finalScreen);
    finalTitle.textContent = `PARABÉNS ${players[0]}! VOCÊ SOBREVIVEU AO GRANDE DESAFIO DA CASA!`;
}

restartGameButton.addEventListener('click', () => {
    location.reload(); // Recarrega a página para reiniciar
});
