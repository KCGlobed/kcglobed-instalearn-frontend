import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function CorporateRoute() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const userRole = localStorage.getItem("userRole") || "";
    const isCorporate = userRole.toLowerCase().includes("corporate");

    if (!isAuthenticated) return <Navigate to="/login" />;
    
    if (!isCorporate) {
        // Return a basic 404 screen when a non-corporate user tries to access this route
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
                <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
                <a href="/" className="px-6 py-3 bg-[#A435F0] hover:bg-[#8B1AD3] text-white rounded font-medium transition-colors">
                    Go back to Home
                </a>
            </div>
        );
    }
    
    return <Outlet />;
}
