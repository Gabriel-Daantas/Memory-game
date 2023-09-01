const trapezoids = document.querySelectorAll('.trapeziun');
const startButton = document.querySelector('.hexagon-content');

const levelDisplay = document.querySelector('.scoreboard h1');
const chancesDisplay = document.querySelector('.scoreboard h2:nth-child(2)');
const bestScoreDisplay = document.querySelector('.scoreboard h2:nth-child(3)');

let activeTrapezoid = null;
let clickedTrapezoids = 0;
let nivel = 0;
let bestScore = 0;
let mistakes = 0;
let indexes = []
let repeatIndexes = []

// ______________________________________________________________________________________________

async function activateRandomTrapezoid() {
    for (let i = 0; i < nivel; i++) {
        let randomIndex = Math.floor(Math.random() * trapezoids.length);
        indexes.push(randomIndex);
        repeatIndexes.push(randomIndex);

        trapezoids[randomIndex].classList.add('activate-trapeziun');
        await new Promise(resolve => setTimeout(resolve, 1000));
        trapezoids[randomIndex].classList.remove('activate-trapeziun');

        await new Promise(resolve => setTimeout(resolve, 300));
    }
    for (let i = 0; i < 6; i++) {
        trapezoids[i].classList.add('trapeziun-hover');
    }
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
        trapezoids[index].classList.remove(`trapeziun-${index + 1}`);
        trapezoids[index].classList.add('activate-trapeziun', 'correct-trapeziun');
        await new Promise(resolve => setTimeout(resolve, 250));
        trapezoids[index].classList.remove('activate-trapeziun', 'correct-trapeziun');
        trapezoids[index].classList.add(`trapeziun-${index + 1}`);

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
            for (let i=0; i < repeatIndexes.length; i++) {
                indexes.push(repeatIndexes[i])
            }
            activateTrapezoidAgain()
        }
    }
}


for (let i = 0; i < trapezoids.length; i++) {
    trapezoids[i].addEventListener('click', async () => {
        if (indexes != '') {
            handleClickTrapezoid(i);
        }
    });
}


async function levelUp() {
    if (indexes == '') {
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.add('trapeziun-hover');
            trapezoids[i].classList.remove('trapeziun-hover');
        }
        repeatIndexes = []
        nivel++
        updateGame()

        startGame()
        await new Promise(resolve => setTimeout(resolve, 2000));
        activateRandomTrapezoid();
    }
}

async function startGame() {
    for (let n = 0; n < 2; n++) {
        await new Promise(resolve => setTimeout(resolve, 250));
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.remove(`trapeziun-${i + 1}`);
            trapezoids[i].classList.add('activate-trapeziun', 'correct-trapeziun');
        }

        await new Promise(resolve => setTimeout(resolve, 250));
        for (let i = 0; i < 6; i++) {
            trapezoids[i].classList.add(`trapeziun-${i + 1}`);
            trapezoids[i].classList.remove('activate-trapeziun', 'correct-trapeziun');
        }
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
}

function updateGame() {
    levelDisplay.textContent = `Nível: ${nivel}`;
    chancesDisplay.textContent = `Chances restantes: ${3 - mistakes}`;
    bestScoreDisplay.textContent = `Melhor pontuação: ${bestScore}`;
}

async function restartGame() {
    for (let i = 0; i < 6; i++) {
        trapezoids[i].classList.remove('trapeziun-hover');
    }

    bestScore = nivel
    nivel = 0;
    mistakes = 0;
    indexes = []
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
    updateGame();
    startButton.textContent = 'Iniciar';
}

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

updateGame();