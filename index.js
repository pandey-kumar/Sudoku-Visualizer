const sample = [
    ["5", "3", "", "", "7", "", "", "", ""],
    ["6", "", "", "1", "9", "5", "", "", ""],
    ["", "9", "8", "", "", "", "", "6", ""],
    ["8", "", "", "", "6", "", "", "", "3"],
    ["4", "", "", "8", "", "3", "", "", "1"],
    ["7", "", "", "", "2", "", "", "", "6"],
    ["", "6", "", "", "", "", "2", "8", ""],
    ["", "", "", "4", "1", "9", "", "", "5"],
    ["", "", "", "", "8", "", "", "7", "9"]
];

const board = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];

let delay = 100; 

class SudokuSolver {
    constructor() {
        this.n = 9;
        this.stepsQueue = [];
        this.solved = false;
    }

    isValid(seen, i, j, val) {
        const rowKey = `row_${i}_${val}`;
        const colKey = `col_${j}_${val}`;
        const boxKey = `box_${Math.floor(i / 3)}_${Math.floor(j / 3)}_${val}`;
        
        return !seen.has(rowKey) && !seen.has(colKey) && !seen.has(boxKey);
    }

    placeValue(seen, i, j, val) {
        const rowKey = `row_${i}_${val}`;
        const colKey = `col_${j}_${val}`;
        const boxKey = `box_${Math.floor(i / 3)}_${Math.floor(j / 3)}_${val}`;
        board[i][j] = val;
        seen.add(rowKey);
        seen.add(colKey);
        seen.add(boxKey);
    }

    removeValue(seen, i, j, val) {
        const rowKey = `row_${i}_${val}`;
        const colKey = `col_${j}_${val}`;
        const boxKey = `box_${Math.floor(i / 3)}_${Math.floor(j / 3)}_${val}`;
        board[i][j] = '';
        seen.delete(rowKey);
        seen.delete(colKey);
        seen.delete(boxKey);
    }

    solveSudokuHelper(board, seen, i, j) {
        if (this.solved) return; // Stop if already solved
        
        if (i === this.n) {
            this.solved = true;
            return;
        }
        
        if (j === this.n) {
            this.solveSudokuHelper(board, seen, i + 1, 0);
            return;
        }

        if (board[i][j] === '') {
            for (let val = 1; val <= 9; ++val) {
                const charVal = val.toString();
                if (this.isValid(seen, i, j, charVal)) {
                    this.placeValue(seen, i, j, charVal);
                    this.stepsQueue.push({ i, j, val: charVal }); // Store step
                    this.solveSudokuHelper(board, seen, i, j + 1);
                    if (this.solved) return;
                    this.removeValue(seen, i, j, charVal);
                }
            }
            board[i][j] = ''; // Reset board cell if no valid number found
        } else {
            this.solveSudokuHelper(board, seen, i, j + 1);
        }
    }

    solveSudoku(board) {
        const seen = new Set();

        for (let i = 0; i < this.n; ++i) {
            for (let j = 0; j < this.n; ++j) {
                if (board[i][j] !== '') {
                    this.placeValue(seen, i, j, board[i][j]);
                }
            }
        }

        this.solveSudokuHelper(board, seen, 0, 0);
    }

    async solveWithDelay() {
        const delayAsync = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        for (const step of this.stepsQueue) {
            const { i, j, val } = step;
            this.updateUI(i, j, val);
            await delayAsync(delay);
            this.clearColor(i, j);
        }
    }

    clearColor(row, col) {
        $(`#cell-${row}-${col}`).css('background-color', 'white');
    }

    updateUI(row, col, value) {
        $(`#cell-${row}-${col}`).val(value);
        $(`#cell-${row}-${col}`).css('background-color', 'rgba(255, 0, 0, 0.784)');
    }
}

$(document).ready(function () {
    $('#delay').text(delay);

    $('#solve-button').click(function () {
        const solver = new SudokuSolver();
        solver.solveSudoku(board);
        solver.solveWithDelay();
    });

    $('#plus-delay').click(function() {
        delay += 100;
        $('#delay').text(delay);
    });

    $('#minus-delay').click(function() {
        delay -= 100;
        if (delay < 0) delay = 0;
        $('#delay').text(delay);
    });

    $('input').change(function(e) {
        const cell = $(e.target).attr('id');
        const row = parseInt(cell.split('-')[1]);
        const col = parseInt(cell.split('-')[2]);
        board[row][col] = $(e.target).val() !== '' ? $(e.target).val() : '';
    });
    
    $('#clear-button').click(function () {
        $('input').val('');
        $('input').css('background-color', 'white'); // Reset background color
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
                board[i][j] = '';
            }
        }
    });

    $('#sample-button').click(function () {
        for (let i = 0; i < 9; ++i) {
            for (let j = 0; j < 9; ++j) {
                $(`#cell-${i}-${j}`).val(sample[i][j]);
                board[i][j] = sample[i][j] !== '' ? sample[i][j] : '';
            }
        }
    });
});
