const trapezoids = document.querySelectorAll('.trapeziun');
const startButtonBox = document.querySelector('.hexagon');
const startButton = document.querySelector('.hexagon-content');
const resetButton = document.querySelector('.reset-button');

const levelDisplay = document.querySelector('.game-container h1');
const playernameDisplay = document.querySelector('.scoreboard h1')
const chancesDisplay = document.querySelector('.infos h2:nth-child(1)');
const bestScoreDisplay = document.querySelector('.infos h2:nth-child(2)');

const playerListContainer = document.querySelector('.player-list');
const ul = document.createElement('ul');

const playerNameInput = document.querySelector('.player-name-input');
const playerButton = document.querySelector('.player-name-button');

let activeTrapezoid = null;
let clickedTrapezoids = 0;
let nivel = 0;
let playerName = '';
let bestScore = 0;
let mistakes = 0;
let indexes = []
let repeatIndexes = []

// ______________________________________________________________________________________________

async function activateRandomTrapezoid() {
    let randomIndex = Math.floor(Math.random() * trapezoids.length);
    indexes.push(randomIndex);

    for (let i = 0; i < indexes.length; i++) {
        trapezoids[indexes[i]].classList.add('activate-trapeziun');
        await new Promise(resolve => setTimeout(resolve, 1000));
        trapezoids[indexes[i]].classList.remove('activate-trapeziun');

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    for (let i = 0; i < 6; i++) {
        trapezoids[i].classList.add('trapeziun-hover');
    }
    repeatIndexes.push(randomIndex);
}


async function activateTrapezoidAgain() {
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < indexes.length; i++) {
        trapezoids[indexes[i]].classList.add('activate-trapeziun');
        await new Promise(resolve => setTimeout(resolve, 1000));
        trapezoids[indexes[i]].classList.remove('activate-trapeziun');

        await new Promise(resolve => setTimeout(resolve, 300));
    }

    for (let i = 0; i < 6; i++) {
        trapezoids[i].classList.add('trapeziun-hover');
    }
}


async function handleClickTrapezoid(index) {
    if (index == indexes[0]) {
        // trapezoids[index].classList.remove(`trapeziun-${index + 1}`);
        // trapezoids[index].classList.add('activate-trapeziun', 'correct-trapeziun');
        // await new Promise(resolve => setTimeout(resolve, 250));
        // trapezoids[index].classList.remove('activate-trapeziun', 'correct-trapeziun');
        // trapezoids[index].classList.add(`trapeziun-${index + 1}`);

        indexes.shift()
        levelUp()

    } else {
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.remove('trapeziun-hover');
        }

        for (let n = 0; n < 2; n++) {
            await new Promise(resolve => setTimeout(resolve, 250));
            for (let i = 0; i < 6; i++) {
                trapezoids[i].classList.remove(`trapeziun-${i + 1}`);
                trapezoids[i].classList.add('activate-trapeziun', 'wrong-trapeziun');
            }

            await new Promise(resolve => setTimeout(resolve, 250));
            for (let i = 0; i < 6; i++) {
                trapezoids[i].classList.add(`trapeziun-${i + 1}`);
                trapezoids[i].classList.remove('activate-trapeziun', 'wrong-trapeziun');
            }
        }

        mistakes++;
        updateGame();

        if (mistakes == 3) {
            alert('Ops! Parece que suas chances acabaram.')
            restartGame()

        } else {
            indexes = []
            repeatIndexes.forEach(function (index) {
                indexes.push(index)
            });

            activateTrapezoidAgain()
        }
    }
}


async function levelUp() {
    if (indexes == '') {
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.add('trapeziun-hover');
            trapezoids[i].classList.remove('trapeziun-hover');
        }

        repeatIndexes.forEach(function (index) {
            indexes.push(index)
        });

        nivel++
        updateGame()

        // startGame()
        blinkLevelText()
        await new Promise(resolve => setTimeout(resolve, 2000));
        activateRandomTrapezoid();
    }
}


// async function startGame() {
//     for (let n = 0; n < 2; n++) {
//         await new Promise(resolve => setTimeout(resolve, 250));
//         for (let i = 0; i < 6; i++) {
//             trapezoids[i].classList.remove(`trapeziun-${i + 1}`);
//             trapezoids[i].classList.add('activate-trapeziun', 'correct-trapeziun');
//         }

//         await new Promise(resolve => setTimeout(resolve, 250));
//         for (let i = 0; i < 6; i++) {
//             trapezoids[i].classList.add(`trapeziun-${i + 1}`);
//             trapezoids[i].classList.remove('activate-trapeziun', 'correct-trapeziun');
//         }
//     }
//     await new Promise(resolve => setTimeout(resolve, 2500));
// }


async function blinkLevelText() {
    for (let n = 0; n < 2; n++) {
        await new Promise(resolve => setTimeout(resolve, 250));
        levelDisplay.classList.add('correct-level');

        await new Promise(resolve => setTimeout(resolve, 250));
        levelDisplay.classList.remove('correct-level');
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
}


function updateGame() {
    levelDisplay.textContent = `Nível: ${nivel}`;
    chancesDisplay.textContent = `Chances restantes: ${3 - mistakes}`;
}


function updateScoreData() {
    let playerData = JSON.parse(localStorage.getItem('playerData')) || [];
    let playerIndex = playerData.findIndex(player => player.name === playerName);
    if (playerData[playerIndex].score < nivel) {
        if (nivel == 0) {
            bestScore = 0
        } else {
            bestScore = nivel - 1
        }
        bestScoreDisplay.textContent = `Melhor pontuação: ${bestScore}`;

        playerData[playerIndex].score = bestScore;
        localStorage.setItem('playerData', JSON.stringify(playerData));
    }
}


async function restartGame() {
    for (let i = 0; i < 6; i++) {
        trapezoids[i].classList.remove('trapeziun-hover');
    }

    updateScoreData()

    nivel = 0;
    mistakes = 0;
    indexes = []
    repeatIndexes = []

    for (let n = 0; n < 2; n++) {
        for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            trapezoids[i].classList.add('activate-trapeziun');
        }

        for (let i = 0; i < 6; i++) {
            await new Promise(resolve => setTimeout(resolve, 200));
            trapezoids[i].classList.remove('activate-trapeziun');
        }
    }

    for (let n = 0; n < 2; n++) {
        await new Promise(resolve => setTimeout(resolve, 250));
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.add('activate-trapeziun');
        }

        await new Promise(resolve => setTimeout(resolve, 250));
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.remove('activate-trapeziun');
        }
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    startButton.textContent = 'Iniciar';

    updateList();
    updateGame();
}


function updateList() {
    const ulElement = document.querySelector('ul');

    if (ulElement !== null) {
        ulElement.remove();
    }

    const newUl = document.createElement('ul');

    let playerData = JSON.parse(localStorage.getItem('playerData')) || [];
    playerData.sort((a, b) => b.score - a.score);

    playerData.forEach(function (data, index) {
        const li = document.createElement('li');
        li.textContent = `#${index + 1}: ${data.name} --- Pontuação: ${data.score}`;
        newUl.appendChild(li);
    });

    const playerListContainer = document.querySelector('.player-list');

    playerListContainer.appendChild(newUl);
}


playerButton.addEventListener('click', async function () {
    playerName = playerNameInput.value.trim();

    if (playerName !== '') {
        let playerData = JSON.parse(localStorage.getItem('playerData')) || [];
        let playerIndex = playerData.findIndex(player => player.name === playerName);

        if (playerIndex !== -1) {

        } else {
            playerData.push({
                name: playerName,
                score: bestScore
            });
        }
        localStorage.setItem('playerData', JSON.stringify(playerData));

        playerNameInput.classList.add('hidden-element');
        playerButton.classList.add('hidden-element');
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.add('hidden-element');
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        playernameDisplay.classList.add('show-element');
        startButtonBox.classList.add('show-element');
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.remove(`trapeziun-animation-${i + 1}`, 'hidden-element');
            trapezoids[i].classList.add('show-trapeziun');
        }

        playernameDisplay.textContent = `${playerName}`;
        bestScoreDisplay.textContent = `Melhor pontuação: ${playerData[playerIndex].score}`;

        await new Promise(resolve => setTimeout(resolve, 2000));
        startButtonBox.classList.remove('hidden-element');
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.remove('show-trapeziun');
        }

    } else {
        alert('Insira um nome por favor.')
    }
});


startButton.addEventListener('click', () => {
    if (startButton.textContent.trim() == 'Iniciar') {
        startButton.textContent = 'Reiniciar';
        nivel = 0;
        mistakes = 0;
        levelUp()
    } else {
        restartGame()
    }
});


resetButton.addEventListener("click", function () {
    updateScoreData()
    location.reload();
});


for (let i = 0; i < trapezoids.length; i++) {
    trapezoids[i].addEventListener('click', async () => {
        if (repeatIndexes.length == nivel && repeatIndexes.length > 0) {
            console.log(repeatIndexes.length)
            console.log(nivel)
            console.log('são iguais')

            handleClickTrapezoid(i);

        } else {
            console.log(nivel)
            console.log(repeatIndexes.length)
            console.log('Não são iguais ou não é maior que 0')
        }
    });
}

updateList();
updateGame();
