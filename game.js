// Select all the cell elements and the status area from the document

const cells = document.querySelectorAll('.cell');
const statusArea = document.getElementById('statusArea');
const showSuggestionsButton = document.getElementById('showSuggestions');

// Initial game states 
let currentPlayer = 'X';  // Human starts as X by default
let gameOver = false; // Flag for tracking end of the game

// Definition of all possible winning combinations
const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]            // diagonals
];

// Setting up click event listeners to each cell in the game grid
cells.forEach(cell => {
    cell.addEventListener('click', function() {
        if (cell.textContent.trim() === '' && !gameOver && currentPlayer === 'X') {
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer);
            
            if (checkWinner(currentPlayer)) { // Check if current player has won
                gameOver = true;
                updateStatus(`${currentPlayer} wins!`);
                return;
            } else if (emptyCells().length === 0) { // if no empty cells left declare a draw
                gameOver = true;
                updateStatus("Draw!");
                return;
            }

            // change to the other player
            currentPlayer = 'O';
            updateStatus("AI's turn");
            setTimeout(aiMove, 1000);
        }
    });
});

// event listener for suggestions
showSuggestionsButton.addEventListener('click', function() {
    if (!gameOver && currentPlayer === 'X') {
        highlightSuggestions();
    }
});

// AI function to make a move
function aiMove() {
    let bestMove = minimax('O', 0, true);
    cells[bestMove.index].textContent = 'O';
    cells[bestMove.index].classList.add('O');
    if (checkWinner('O')) {
        gameOver = true;
        updateStatus("O wins!");
    } else if (emptyCells().length === 0) {
        gameOver = true;
        updateStatus("Draw!");
    } else {
        currentPlayer = 'X';
        updateStatus("Player X's turn");
    }
}

// Minimax algorithm for next move
function minimax(player, depth, isMaximizing) {
    if (checkWinner(player === 'O' ? 'X' : 'O')) {
        return { score: isMaximizing ? -10 + depth : 10 - depth }; // Adjust for depth to prioritize faster wins or blocks
    }
    if (emptyCells().length === 0) {
        return { score: 0 };
    }

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestMove = -1;

    for (let index of emptyCells()) {
        cells[index].textContent = player;
        let result = minimax(player === 'O' ? 'X' : 'O', depth + 1, !isMaximizing);
        cells[index].textContent = '';

        if ((isMaximizing ? result.score > bestScore : result.score < bestScore)) {
            bestScore = result.score;
            bestMove = index;
        }
    }

    return { index: bestMove, score: bestScore };
}

// Highlight best suggestion choice for player X
function highlightSuggestions() {
    if (currentPlayer !== 'X' || gameOver) return;
    let bestMove = minimax('X', 0, false);
    if (bestMove.index !== null) {
        cells[bestMove.index].style.backgroundColor = '#add8e6';
        setTimeout(() => {
            cells[bestMove.index].style.backgroundColor = '';
        }, 2000);
    }
}

// Check if there's a winning player 
function checkWinner(player) {
    return winningCombinations.some(combo => combo.every(index => cells[index].textContent === player));
}

// Get indices of empty cells
function emptyCells() {
    return [...cells].filter(cell => cell.textContent === '').map(cell => Number(cell.dataset.cell));
}

// Update status
function updateStatus(message) {
    statusArea.textContent = message;
}

// Reset function that resets game when triggered
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
        cell.style.backgroundColor = ''; // Reset background color on reset
    });
    gameOver = false;
    currentPlayer = 'X';
    updateStatus("Player X's turn");
}

document.getElementById('reset').addEventListener('click', resetGame);
