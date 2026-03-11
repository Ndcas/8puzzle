import React from "react"
import Header from "./components/Header"
import ControlPanel from "./components/ControlPanel"
import "./styles/global.css"

function App() {
  return (
    <div className="app">
      <Header />
      <ControlPanel />
    </div>
  )
}

export default App