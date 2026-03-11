import React, { useState } from "react"
import PuzzleBoard from "./PuzzleBoard"
import ResultPanel from "./ResultPanel"
import SolutionViewer from "./SolutionViewer"
import State from "../../../models/State"
import solveWithDFS from "../../../solvers/DFS"
import "../styles/control.css"

type Board = number[][]

type Result = {
  algorithm: string
  depth: number
  expandedNodes: number
  time: number
  steps: number[][][]
}

const DEFAULT_INITIAL: Board = [[1,2,3],[4,0,5],[7,8,6]]
const DEFAULT_GOAL: Board    = [[1,2,3],[4,5,6],[7,8,0]]

export default function ControlPanel() {
  const [initialBoard, setInitialBoard] = useState<Board>(DEFAULT_INITIAL)
  const [goalBoard,    setGoalBoard]    = useState<Board>(DEFAULT_GOAL)
  const [algorithm,    setAlgorithm]    = useState<string>("dfs")
  const [result,       setResult]       = useState<Result | null>(null)
  const [error,        setError]        = useState<string | null>(null)

  const updateCell =
    (setter: React.Dispatch<React.SetStateAction<Board>>) =>
    (row: number, col: number, value: number | "") => {
      setter(prev => {
        const next = prev.map(r => [...r])
        next[row][col] = value === "" ? 0 : Number(value)
        return next
      })
    }

  const handleSolve = () => {
    setError(null)
    setResult(null)
    try {
      const flatGoal = goalBoard.flat()
      const goalNumber = flatGoal.reduce((acc, val) => acc * 10 + val, 0)
      State.updateGoal(goalNumber)

      const flatInitial = initialBoard.flat()
      const startState = new State()
      flatInitial.forEach((val, idx) => {
        startState.setTile(Math.floor(idx / 3), idx % 3, val)
      })

      if (!startState.isSolvable()) {
        setError("Trạng thái không thể giải được.")
        return
      }

      const solution = solveWithDFS(startState)

      if (!solution.tree) {
        setError("Không tìm được lời giải (vượt quá độ sâu giới hạn).")
        return
      }

      const steps: number[][][] = solution.tree
        .getStates()
        .map(s => s.to2DArray())

      setResult({
        algorithm,
        depth:         solution.tree.getDepth(),
        expandedNodes: solution.visitCount,
        time:          solution.timeTaken,
        steps,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định")
    }
  }

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
        <label htmlFor="algo-select">Thuật toán:</label>
        <select
          id="algo-select"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="dfs">DFS</option>
        </select>
      </div>

      <div className="button-row">
        <button className="btn btn-primary" onClick={handleSolve}>
          Giải Puzzle
        </button>
      </div>

      {error  && <p className="error-msg">{error}</p>}
      {result && <ResultPanel result={result} />}
      {result && <SolutionViewer steps={result.steps} />}
    </div>
  )
}