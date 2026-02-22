import React, { useState, useEffect, useCallback } from 'react';
import type { MinesweeperCell } from '../../types';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

export const Minesweeper: React.FC = () => {
  const [board, setBoard] = useState<MinesweeperCell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [flagCount, setFlagCount] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: MinesweeperCell[][] = [];
    for (let row = 0; row < ROWS; row++) {
      newBoard[row] = [];
      for (let col = 0; col < COLS; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
        };
      }
    }
    return newBoard;
  }, []);

  // Place mines (after first click)
  const placeMines = useCallback((board: MinesweeperCell[][], excludeRow: number, excludeCol: number) => {
    let minesPlaced = 0;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    
    while (minesPlaced < MINES) {
      const row = Math.floor(Math.random() * ROWS);
      const col = Math.floor(Math.random() * COLS);
      
      if (!newBoard[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }
    
    // Calculate neighbor mines
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
              const nr = row + r;
              const nc = col + c;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }
    
    return newBoard;
  }, []);

  // Reveal cell
  const revealCell = useCallback((row: number, col: number, currentBoard: MinesweeperCell[][]) => {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return currentBoard;
    if (currentBoard[row][col].isRevealed || currentBoard[row][col].isFlagged) return currentBoard;
    
    const newBoard = currentBoard.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].isRevealed = true;
    
    if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          revealCell(row + r, col + c, newBoard);
        }
      }
    }
    
    return newBoard;
  }, []);

  // Check win condition
  const checkWin = useCallback((board: MinesweeperCell[][]) => {
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Handle click
  const handleClick = (row: number, col: number) => {
    if (gameOver || gameWon || board[row][col].isFlagged) return;
    
    if (firstClick) {
      const newBoard = placeMines(initializeBoard(), row, col);
      const revealedBoard = revealCell(row, col, newBoard);
      setBoard(revealedBoard);
      setFirstClick(false);
      setIsPlaying(true);
      return;
    }
    
    if (board[row][col].isMine) {
      // Reveal all mines
      const newBoard = board.map(r => r.map(c => ({ 
        ...c, 
        isRevealed: c.isMine ? true : c.isRevealed 
      })));
      setBoard(newBoard);
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    
    const newBoard = revealCell(row, col, board);
    setBoard(newBoard);
    
    if (checkWin(newBoard)) {
      setGameWon(true);
      setIsPlaying(false);
    }
  };

  // Handle right click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameOver || gameWon || board[row][col].isRevealed) return;
    
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setFlagCount(prev => newBoard[row][col].isFlagged ? prev + 1 : prev - 1);
  };

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && time < 999) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, time]);

  // Reset game
  const resetGame = () => {
    setBoard(initializeBoard());
    setGameOver(false);
    setGameWon(false);
    setFlagCount(0);
    setTime(0);
    setIsPlaying(false);
    setFirstClick(true);
  };

  // Initialize
  useEffect(() => {
    setBoard(initializeBoard());
  }, [initializeBoard]);

  const getCellContent = (cell: MinesweeperCell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines;
  };

  const getCellColor = (cell: MinesweeperCell) => {
    if (!cell.isRevealed) return '';
    const colors = ['', 'text-blue-700', 'text-green-700', 'text-red-700', 'text-purple-700', 'text-yellow-700', 'text-cyan-700', 'text-black', 'text-gray-700'];
    return colors[cell.neighborMines] || '';
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-2">
      {/* Header */}
      <div className="win95-border-sunken bg-[#c0c0c0] p-2 mb-2 flex justify-between items-center">
        <div className="win95-border-sunken bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[60px] text-center">
          {String(MINES - flagCount).padStart(3, '0')}
        </div>
        
        <button 
          className="win95-button w-10 h-10 text-2xl"
          onClick={resetGame}
        >
          {gameOver ? '😵' : gameWon ? '😎' : '🙂'}
        </button>
        
        <div className="win95-border-sunken bg-black text-red-500 font-mono text-xl px-2 py-1 min-w-[60px] text-center">
          {String(time).padStart(3, '0')}
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className="grid gap-0"
          style={{ gridTemplateColumns: `repeat(${COLS}, 20px)` }}
        >
          {board.map((row, rowIndex) => 
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-5 h-5 flex items-center justify-center text-xs font-bold ${
                  cell.isRevealed 
                    ? 'bg-[#c0c0c0] border border-gray-500' 
                    : 'win95-button w-5 h-5 p-0 active:p-0'
                } ${getCellColor(cell)}`}
                onClick={() => handleClick(rowIndex, colIndex)}
                onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
                disabled={cell.isRevealed && !cell.isMine}
              >
                {getCellContent(cell)}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
