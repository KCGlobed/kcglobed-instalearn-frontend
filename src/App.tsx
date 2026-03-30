import Home from "./pages/Home/Index"
import { Route, Routes } from "react-router-dom"
import Testing from "./pages/Testing"
import LoginPage from "./pages/login"
import ForgotPassword from "./pages/ForgotPassword/Index"
import ResetPassword from "./pages/ResetPassword/Index"
import Courses from "./pages/Courses"
import CategoryPage from "./pages/Categories"
import CourseDetail from "./pages/CourseDetail"
import ComingSoon from "./pages/CommingSoon"
import WatchCourse from "./pages/WatchCourse"

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
        <Route path="/courses/detail" element={<CourseDetail />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/watch-course" element={<WatchCourse />} />
      </Routes>
    </>
  )
}

export default App
