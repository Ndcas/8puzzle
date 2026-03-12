import "../styles/solution.css"

type SolutionViewerProps = {
  steps: number[][][]  // mỗi step là Board 3x3
}

function SolutionViewer({ steps }: SolutionViewerProps) {
  if (!steps || steps.length === 0) {
    return <p></p>
  }

  return (
    <div className="solution-viewer">
      <h2>Các bước giải</h2>

      <div className="solution-steps">
        {steps.map((board, index) => (
          <div key={index} className="step-container">
            <p className="step-label">Bước {index}</p>

            <div className="grid">
              {board.flat().map((num, i) => (
                <div
                  key={i}
                  className={`cell ${num === 0 ? "empty" : ""}`}
                >
                  {num !== 0 ? num : ""}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SolutionViewer