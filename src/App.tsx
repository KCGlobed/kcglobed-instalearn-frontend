import Home from "./pages/Home/Index"
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"
import LoginPage from "./pages/login"
import ForgotPassword from "./pages/ForgotPassword/Index"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </>
  )
}

export default App
