class Connect4 {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.createBoard();
        this.setupGame();
    }

    createBoard() {
        const container = document.querySelector('.connect-four-container');
        container.innerHTML = '';

        const status = document.createElement('div');
        status.className = 'game-status';
        status.textContent = 'Your turn!';
        container.appendChild(status);

        const board = document.createElement('div');
        board.className = 'game-board';

        for (let col = 0; col < this.cols; col++) {
            const column = document.createElement('div');
            column.className = 'column';
            column.dataset.col = col;

            for (let row = 0; row < this.rows; row++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                column.appendChild(cell);
            }

            board.appendChild(column);
        }

        container.appendChild(board);
        const resetBtn = document.createElement('button');
        resetBtn.className = 'reset-btn';
        resetBtn.textContent = 'New Game';
        resetBtn.onclick = () => this.resetGame();
        container.appendChild(resetBtn);
    }

    setupGame() {
        const board = document.querySelector('.game-board');
        board.onclick = (e) => {
            if (this.gameOver) return;
            const column = e.target.closest('.column');
            if (!column) return;
            
            const col = parseInt(column.dataset.col);
            this.makeMove(col);
        };
    }

    makeMove(col) {
        if (this.gameOver) return;

        const row = this.getEmptyRow(col);
        if (row === null) return;

        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);

        if (this.checkWin(row, col)) {
            this.gameOver = true;
            this.updateStatus(this.currentPlayer === 1 ? 'You win!' : 'Computer wins!');
            return;
        }
        if (this.isDraw()) {
            this.gameOver = true;
            this.updateStatus("It's a draw!");
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateStatus(this.currentPlayer === 1 ? 'Your turn!' : 'Computer thinking...');

        if (this.currentPlayer === 2) {
            setTimeout(() => {
                this.makeComputerMove();
            }, 500);
        }
    }

    makeComputerMove() {
        // Simple CPU
        let col = this.findBestMove();
        if (col === null) {
            do {
                col = Math.floor(Math.random() * this.cols);
            } while (this.getEmptyRow(col) === null);
        }
        this.makeMove(col);
    }

    findBestMove() {
        for (let col = 0; col < this.cols; col++) {
            let row = this.getEmptyRow(col);
            if (row !== null) {
                this.board[row][col] = 2;
                if (this.checkWin(row, col)) {
                    this.board[row][col] = null;
                    return col;
                }
                this.board[row][col] = null;
            }
        }

        
        for (let col = 0; col < this.cols; col++) {
            let row = this.getEmptyRow(col);
            if (row !== null) {
                this.board[row][col] = 1;
                if (this.checkWin(row, col)) {
                    this.board[row][col] = null;
                    return col;
                }
                this.board[row][col] = null;
            }
        }

        return null;
    }

    getEmptyRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (!this.board[row][col]) return row;
        }
        return null;
    }

    updateCell(row, col) {
        const cell = document.querySelector(`.column[data-col="${col}"] .cell:nth-child(${row + 1})`);
        cell.className = `cell player${this.currentPlayer}`;
    }

    updateStatus(message) {
        document.querySelector('.game-status').textContent = message;
    }

    checkWin(row, col) {
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal right
            [1, -1]  // diagonal left
        ];

        return directions.some(([dx, dy]) => {
            return this.countPieces(row, col, dx, dy) >= 4;
        });
    }

    countPieces(row, col, dx, dy) {
        const player = this.board[row][col];
        let count = 1;
        let x, y;

    
        x = col + dx;
        y = row + dy;
        while (y >= 0 && y < this.rows && x >= 0 && x < this.cols && this.board[y][x] === player) {
            count++;
            x += dx;
            y += dy;
        }

    
        x = col - dx;
        y = row - dy;
        while (y >= 0 && y < this.rows && x >= 0 && x < this.cols && this.board[y][x] === player) {
            count++;
            x -= dx;
            y -= dy;
        }

        return count;
    }

    isDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    resetGame() {
        this.board = Array(this.rows).fill().map(() => Array(this.cols).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.createBoard();
        this.setupGame();
    }
}

document.addEventListener('DOMContentLoaded', () => new Connect4());
