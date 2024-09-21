// Select all the cell elements in the game board using the 'data-cell' attribute
const cells = document.querySelectorAll('[data-cell]');
// Select the board element where the game cells are placed
const board = document.getElementById('board');
// Select the message element where the game result (win or draw) will be displayed
const messageElement = document.getElementById('message');
// Select the restart button element
const restartButton = document.getElementById('restartButton');

// Variable to keep track of the current player ('X' starts first)
let currentPlayer = 'X';
// Flag to indicate if the game is currently active or over
let gameActive = true;
// Constants representing the CSS classes for X and O
const X_CLASS = 'x';
const O_CLASS = 'o';

// Define the winning combinations in terms of cell indices on the board
const WINNING_COMBINATIONS = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
];

// Initialize the game by calling the startGame function
startGame();

// Add an event listener to the restart button that restarts the game when clicked
restartButton.addEventListener('click', startGame);

// Function to start a new game or restart the current one
function startGame() {
    currentPlayer = 'X'; // Set the first player to 'X'
    gameActive = true; // Reset the game to active
    messageElement.innerText = ''; // Clear any previous win/draw message
    // For each cell in the game board, remove any X or O classes and add a click listener
    cells.forEach(cell => {
        cell.classList.remove(X_CLASS); // Clear 'X' mark
        cell.classList.remove(O_CLASS); // Clear 'O' mark
        // Add click event listener that will only allow one click per cell
        cell.addEventListener('click', handleClick, { once: true });
    });
}

// Function that handles a click on a cell
function handleClick(e) {
    const cell = e.target; // Get the clicked cell
    const currentClass = currentPlayer === 'X' ? X_CLASS : O_CLASS; // Determine the current player's class
    placeMark(cell, currentClass); // Place the mark (X or O) on the cell
    if (checkWin(currentClass)) {
        endGame(false); // If the current player wins, end the game without a draw
    } else if (isDraw()) {
        endGame(true); // If the game is a draw, end the game as a draw
    } else {
        swapTurns(); // Otherwise, switch turns and continue the game
    }
}

// Function to place the player's mark (X or O) on the clicked cell
function placeMark(cell, currentClass) {
    cell.classList.add(currentClass); // Add the current player's class to the cell
}

// Function to switch turns between player 'X' and player 'O'
function swapTurns() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Toggle between 'X' and 'O'
}

// Function to check if the current player has won
function checkWin(currentClass) {
    // Check all winning combinations to see if any combination is filled with the current player's marks
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            // Check if all cells in a winning combination contain the current player's mark
            return cells[index].classList.contains(currentClass);
        });
    });
}

// Function to check if the game is a draw (all cells are filled but no winner)
function isDraw() {
    // Check if every cell is filled with either an 'X' or 'O'
    return [...cells].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
    });
}

// Function to end the game and display the result
function endGame(draw) {
    if (draw) {
        messageElement.innerText = 'Draw!'; // Display draw message
    } else {
        messageElement.innerText = `${currentPlayer} Wins!`; // Display win message for the current player
    }
    gameActive = false; // Set the game to inactive (game over)
    // Remove the click event listeners from all cells to prevent further moves
    cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
    });
}
