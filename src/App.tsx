import React, { Suspense, lazy } from "react"
import { Route, Routes } from "react-router-dom"
import PageLoader from "./components/Loader/PageLoader"
import Cart from "./pages/Cart"
import PrivateRoute from "./utils/privateRoutes"
import MyLearning from "./pages/MyLearning"

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home/Index"))
const Testing = lazy(() => import("./pages/Testing"))
const LoginPage = lazy(() => import("./pages/login"))
const ForgotPassword = lazy(() => import("./pages/ForgotPassword/Index"))
const ResetPassword = lazy(() => import("./pages/ResetPassword/Index"))
const Courses = lazy(() => import("./pages/Courses"))
const CategoryPage = lazy(() => import("./pages/Categories"))
const CourseDetail = lazy(() => import("./pages/CourseDetail"))
const ComingSoon = lazy(() => import("./pages/CommingSoon"))
const WatchCourse = lazy(() => import("./pages/WatchCourse"))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/testing" element={<Testing />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user/reset" element={<ResetPassword />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/detail/:id" element={<CourseDetail />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/watch-course" element={<WatchCourse />} />
        <Route path="/cart" element={<Cart />} />
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={"hello"} />
          <Route path="/my-courses/archived/" element={<MyLearning />} />
        </Route>

      </Routes>
    </Suspense>
  )
}

export default App
