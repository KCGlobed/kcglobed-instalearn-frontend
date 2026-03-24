import Home from "./pages/Home/Index"
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"
import LoginPage from "./pages/login"
import ResetPassword from "./pages/ResetPassword/Index"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  )
}

export default App
