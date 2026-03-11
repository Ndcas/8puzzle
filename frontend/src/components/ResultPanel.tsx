import React from "react"
import "../styles/result.css"

type Result = {
  algorithm: string
  depth: number
  expandedNodes: number
  time: number
}

type ResultPanelProps = {
  result: Result | null
}

function ResultPanel({ result }: ResultPanelProps) {
  if (!result) return null

  return (
    <div className="result-panel">
      <h2>Kết quả</h2>

      <p>
        <strong>Thuật toán:</strong> {result.algorithm}
      </p>

      <p>
        <strong>Độ sâu:</strong> {result.depth}
      </p>

      <p>
        <strong>Số nút mở rộng:</strong> {result.expandedNodes}
      </p>

      <p>
        <strong>Thời gian:</strong> {result.time}s
      </p>
    </div>
  )
}

export default ResultPanel