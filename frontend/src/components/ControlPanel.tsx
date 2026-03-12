import React, { useState } from "react"
import PuzzleBoard from "./PuzzleBoard"
import ResultPanel from "./ResultPanel"
import SolutionViewer from "./SolutionViewer"
import State from "../../../models/State"
import solveWithDFS from "../../../solvers/DFS"
import solveWithIDDFS from "../../../solvers/IDDFS"
import solveWithBFS from "../../../solvers/BFS"
import solveWithAStar from "../../../solvers/AStar"
import "../styles/control.css"
import type Solution from "../../../models/Solution"

type Board = number[][]

type Result = {
  algorithm: string
  depth: number
  visitCount: number
  time: number
  steps: number[][][]
}

type Limit = {
  name: string
  value: number
}

const DEFAULT_INITIAL: Board = [[1, 2, 3], [8, 0, 4], [7, 6, 5]]
const DEFAULT_GOAL: Board = [[1, 2, 3], [8, 0, 4], [7, 6, 5]]
const ALGORITHMS = ["Breadth-First Search", "Depth-First Search", "Iterative Deepening Search", "A-star"]
const DEFAULT_LIMITS = new Map<string, Limit>([
  ["Breadth-First Search", { name: "Số trạng thái duyệt tối đa", value: 20000 }],
  ["Depth-First Search", { name: "Độ sâu tối đa", value: 20 }],
  ["Iterative Deepening Search", { name: "Độ sâu tối đa", value: 20 }],
  ["A-star", { name: "Số trạng thái duyệt tối đa", value: 20000 }]
])

export default function ControlPanel() {
  const [limit, setLimit] = useState<Limit>(DEFAULT_LIMITS.get(ALGORITHMS[0])!)
  const [initialBoard, setInitialBoard] = useState<Board>(DEFAULT_INITIAL)
  const [goalBoard, setGoalBoard] = useState<Board>(DEFAULT_GOAL)
  const [algorithm, setAlgorithm] = useState<string>("Breadth-First Search")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSolving, setIsSolving] = useState<boolean>(false)

  const updateCell =
    (setter: React.Dispatch<React.SetStateAction<Board>>) =>
      (row: number, col: number, value: number | "") => {
        setter(prev => {
          const next = prev.map(r => [...r])
          next[row][col] = value === "" ? 0 : Number(value)
          return next
        })
      }

  const changeAlgorithm = (algo: string) => {
    setAlgorithm(algo)
    setLimit(DEFAULT_LIMITS.get(algo)!)
  }

  const handleSolve = async () => {
    setError(null)
    setResult(null)
    setIsSolving(true)

    await new Promise<void>(resolve => setTimeout(resolve, 0))

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

      let solution: Solution | null = null

      switch (algorithm) {
        case "Breadth-First Search":
          solution = solveWithBFS(startState, limit.value)
          break
        case "Depth-First Search":
          solution = solveWithDFS(startState, limit.value)
          break
        case "Iterative Deepening Search":
          solution = solveWithIDDFS(startState, limit.value)
          break
        case "A-star":
          solution = solveWithAStar(startState, limit.value)
          break
      }

      if (!solution || !solution.tree) {
        setError("Không tìm được lời giải, hãy thử tăng tham số giới hạn.")
        return
      }

      const steps: number[][][] = solution.tree
        .getStates()
        .map(s => s.to2DArray())

      setResult({
        algorithm,
        depth: solution.tree.getDepth(),
        visitCount: solution.visitCount,
        time: solution.timeTaken,
        steps,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi không xác định")
    } finally {
      setIsSolving(false)
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
          onChange={(e) => changeAlgorithm(e.target.value)}
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
      </div>

      <div className="control-row">
        <label htmlFor="limit-input">{limit.name}:</label>
        <input
          id="limit-input"
          type="number"
          min="0"
          value={limit.value}
          onChange={(e) => setLimit({ ...limit, value: Number(e.target.value) })}
        />
      </div>

      <div className="button-row">
        <button className="btn btn-primary" onClick={handleSolve} disabled={isSolving}>
          Giải Puzzle
        </button>
      </div>

      {isSolving ? (
        <div className="solving-indicator">
          <span>Đang giải...</span>
        </div>
      ) : (
        <>
          {error && <p className="error-msg">{error}</p>}
          {result && <ResultPanel result={result} />}
          {result && <SolutionViewer steps={result.steps} />}
        </>
      )}
    </div>
  )
}