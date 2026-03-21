import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Signup from "./pages/Signup/Index";
import ForgotPassword from "./pages/ForgotPassword/Index";
import ResetPassword from "./pages/ResetPassword/Index";
import VerifyEmail from "./pages/VerifyEmail/Index";
import TwoStepVerification from "./pages/TwoStepVerification/index";
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"




function App() {

  return (
    <>
      <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/Signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/two-step-verification" element={<TwoStepVerification />} /> 
           <Route path="/testing" element={<Testing />} />

      </Routes>
    </>
  )
}

export default App
