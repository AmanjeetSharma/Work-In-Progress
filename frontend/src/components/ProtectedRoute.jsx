import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "./loader/Loader.jsx";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <Loader />;

    return user ? children : <Navigate to="/" />;
}
