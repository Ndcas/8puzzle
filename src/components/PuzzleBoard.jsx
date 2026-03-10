import React from 'react';
import '../styles/board.css';

function PuzzleBoard({ title, board, onCellChange, editable = false }) {
  const defaultBoard = [
    [1, 2, 3],
    [4, 0, 6],
    [7, 5, 8]
  ];

  const displayBoard = board || defaultBoard;

  const handleInput = (rowIndex, colIndex, value) => {
    if (!onCellChange) return;
    const parsed = value === '' ? '' : parseInt(value, 10);
    if (value === '' || (!isNaN(parsed) && parsed >= 0 && parsed <= 8)) {
      onCellChange(rowIndex, colIndex, parsed === '' ? '' : parsed);
    }
  };

  return (
    <div className="puzzle-board">
      <h2>{title}</h2>
      <div className="grid">
        {displayBoard.flat().map((num, index) => {
          const rowIndex = Math.floor(index / 3);
          const colIndex = index % 3;
          const isEmpty = num === 0;

          if (editable) {
            return (
              <div key={index} className={`cell ${isEmpty ? 'empty' : ''}`}>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={num === 0 ? '' : num}
                  placeholder={num === 0 ? '0' : ''}
                  onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                  className="cell-input"
                />
              </div>
            );
          }

          return (
            <div key={index} className={`cell ${isEmpty ? 'empty' : ''}`}>
              {num !== 0 ? num : ''}
            </div>
          );
        })}
      </div>
      {editable && (
        <p className="board-hint">Nhập số từ 0–8 (0 = ô trống)</p>
      )}
    </div>
  );
}

export default PuzzleBoard;