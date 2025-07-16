// routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import Home from "../pages/Home.jsx";
import Register from "../pages/Register.jsx";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import NotFound from "../pages/NotFound.jsx";
import Profile from "../pages/Profile.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { Toaster } from "react-hot-toast";
import ResetPassword from "../pages/ResetPassword.jsx";
import Contact from "../pages/Contact.jsx";
import About from "../pages/About.jsx";
import AllProducts from "../pages/products/AllProducts.jsx";
import AdminPanel from "../pages/admin/AdminPanel.jsx";
import ProductPage from "../pages/products/ProductPage.jsx";

export default function AppRoutes() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Toaster position="bottom-left" reverseOrder={false} />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/accessories" element={<AllProducts />} />
                    <Route path="/admin-panel" element={<ProtectedRoute requiredRole="ADMIN"><AdminPanel /></ProtectedRoute>} />
                    <Route path="/products/:slug" element={<ProductPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
