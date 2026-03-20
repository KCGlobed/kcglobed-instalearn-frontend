import Home from "./pages/Home/Index"
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/testing" element={<Testing />} />
      </Routes>
    </>
  )
}

export default App
