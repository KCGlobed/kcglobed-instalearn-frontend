import Home from "./pages/Home/Index"
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"
import LoginPage from "./pages/login"
import ForgotPassword from "./pages/ForgotPassword/Index"
import ResetPassword from "./pages/ResetPassword/Index"
import Courses from "./pages/Courses"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset" element={<ResetPassword />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </>
  )
}

export default App
