import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Signup from "./pages/Signup/Index";
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"




function App() {

  return (
    <>
      <Routes>
           <Route path="/" element={<Home />} />
           <Route path="/login" element={<Login />} />
           <Route path="/Signup" element={<Signup />} />
           <Route path="/testing" element={<Testing />} />

      </Routes>
    </>
  )
}

export default App
