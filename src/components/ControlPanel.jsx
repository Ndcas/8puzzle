import React, { useState } from 'react';
import '../styles/control.css';
import PuzzleBoard from './PuzzleBoard';

const DEFAULT_INITIAL = [[1, 2, 4], [4, 0, 6], [7, 5, 8]];
const DEFAULT_GOAL    = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

function randomBoard() {
  const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return [nums.slice(0, 3), nums.slice(3, 6), nums.slice(6, 9)];
}

function ControlPanel() {
  const [algorithm, setAlgorithm]       = useState('ids');
  const [initialBoard, setInitialBoard] = useState(DEFAULT_INITIAL);
  const [goalBoard,    setGoalBoard]    = useState(DEFAULT_GOAL);

  const updateCell = (setter) => (row, col, value) => {
    setter((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value === '' ? 0 : value;
      return next;
    });
  };

  const handleRandom = () => setInitialBoard(randomBoard());

  const handleReset = () => {
    setInitialBoard(DEFAULT_INITIAL);
    setGoalBoard(DEFAULT_GOAL);
  };

  const handleSolve = () => {
    console.log('Solving with', algorithm, initialBoard, goalBoard);
    // TODO: wire up solver
  };

  return (
    <div className="control-panel">
      <div className="boards-row">
        <PuzzleBoard
          title="Trạng thái đầu"
          board={initialBoard}
          onCellChange={updateCell(setInitialBoard)}
          editable
        />
        <PuzzleBoard
          title="Trạng thái đích"
          board={goalBoard}
          onCellChange={updateCell(setGoalBoard)}
          editable
        />
      </div>

      <div className="control-row">
        <label htmlFor="algorithm">Thuật toán:</label>
        <select
          id="algorithm"
          name="algorithm"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="ids">Iterative Deepening Search</option>
          <option value="bfs">Breadth First Search</option>
          <option value="dfs">Depth First Search</option>
        </select>
      </div>

      <div className="button-row">
        <button className="btn" onClick={handleRandom}>Random Số</button>
        <button className="btn" onClick={handleReset}>Làm mới</button>
        <button className="btn btn-primary" onClick={handleSolve}>Giải</button>
      </div>
    </div>
  );
}

export default ControlPanel;