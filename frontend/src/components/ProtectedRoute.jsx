import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="text-white pt-20 px-6">Loading...</div>;

    // If not logged in
    if (!user) return <Navigate to="/" />;

    // If role check is provided and user role doesn't match
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/" />;

    return children;
}
