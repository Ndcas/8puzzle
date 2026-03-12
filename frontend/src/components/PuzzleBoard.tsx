import "../styles/board.css"

type Board = number[][]

type PuzzleBoardProps = {
  title: string
  board?: Board
  onCellChange?: (row: number, col: number, value: number | "") => void
  editable?: boolean
}

function PuzzleBoard({ title, board, onCellChange, editable = false }: PuzzleBoardProps) {

  const defaultBoard: Board = [
    [1, 2, 3],
    [8, 0, 4],
    [7, 6, 5]
  ]

  const displayBoard: Board = board || defaultBoard

  const handleInput = (rowIndex: number, colIndex: number, value: string) => {
    if (!onCellChange) return

    const parsed = value === "" ? "" : parseInt(value, 10)

    if (value === "" || (!isNaN(parsed as number) && (parsed as number) >= 0 && (parsed as number) <= 8)) {
      onCellChange(rowIndex, colIndex, parsed === "" ? "" : (parsed as number))
    }
  }

  return (
    <div className="puzzle-board">
      <h2>{title}</h2>

      <div className="grid">
        {displayBoard.flat().map((num, index) => {

          const rowIndex = Math.floor(index / 3)
          const colIndex = index % 3
          const isEmpty = num === 0

          if (editable) {
            return (
              <div key={index} className={`cell ${isEmpty ? "empty" : ""}`}>
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={num === 0 ? "" : num}
                  placeholder={num === 0 ? "0" : ""}
                  onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                  className="cell-input"
                />
              </div>
            )
          }

          return (
            <div key={index} className={`cell ${isEmpty ? "empty" : ""}`}>
              {num !== 0 ? num : ""}
            </div>
          )

        })}
      </div>

      {editable && (
        <p className="board-hint">Nhập số từ 0–8 (0 = ô trống)</p>
      )}

    </div>
  )
}

export default PuzzleBoard