document.addEventListener("DOMContentLoaded", () => {
    const game = document.getElementById("game");
    const message = document.getElementById("message");
    const restartButton = document.getElementById("restart");

    const gridSize = 5;
    const totalCells = gridSize * gridSize;
    const totalBombs = 5;
    const images = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒', '🍍', '🥭', '🍋', '🍑', '🍏', '🍐', '🍊', '🍈', '🍍', '🍅', '🥥', '🍆', '🥝', '🍔']; // Add more images if needed

    let board = [];
    let revealedCount = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    function createBoard() {
        board = [];
        revealedCount = 0;
        game.innerHTML = '';
        message.textContent = '';
        restartButton.style.display = 'none';

        const cardSymbols = Array(totalBombs).fill('💣').concat(images.slice(0, totalCells - totalBombs));
        shuffle(cardSymbols);

        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('card');
            cell.innerHTML = `
                <div class="front">${cardSymbols[i]}</div>
                <div class="back">?</div>
            `;
            cell.addEventListener('click', handleCardClick);
            game.appendChild(cell);
            board.push({ element: cell, bomb: cardSymbols[i] === '💣', revealed: false });
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function handleCardClick() {
        if (lockBoard) return;
        const cell = board.find(c => c.element === this);
        if (cell.revealed || this === firstCard) return;

        this.classList.add('flipped');
        cell.revealed = true;

        if (!firstCard) {
            firstCard = this;
        } else {
            secondCard = this;
            checkForMatch(cell);
        }
    }

    function checkForMatch(cell) {
        lockBoard = true;

        if (cell.bomb) {
            revealBoard();
            message.textContent = 'Game Over! You hit a bomb!';
            restartButton.style.display = 'block';
        } else {
            if (firstCard.innerHTML === secondCard.innerHTML) {
                revealedCount += 2;
                resetCards();
                if (revealedCount === totalCells - totalBombs) {
                    message.textContent = 'Congratulations! You won!';
                    restartButton.style.display = 'block';
                }
            } else {
                setTimeout(() => {
                    firstCard.classList.remove('flipped');
                    secondCard.classList.remove('flipped');
                    board.forEach(c => {
                        if (c.element === firstCard || c.element === secondCard) {
                            c.revealed = false;
                        }
                    });
                    resetCards();
                }, 1000);
            }
        }
    }

    function resetCards() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function revealBoard() {
        board.forEach(cell => {
            cell.element.classList.add('flipped');
            cell.revealed = true;
        });
    }

    function restartGame() {
        createBoard();
    }

    restartButton.addEventListener('click', restartGame);

    createBoard();
});



