// routes
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import NotFound from "../pages/NotFound";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import ResetPassword from "../pages/ResetPassword";
import Contact from "../pages/Contact";
import About from "../pages/About";
import AllProducts from "../pages/products/AllProducts";
import AdminPanel from "../pages/admin/AdminPanel";
import ProductPage from "../pages/products/productPage/ProductPage";
import { CartProvider } from "../context/CartContext";
import CartPage from "../pages/products/cart/CartPage";

export default function AppRoutes() {
    return (
        <AuthProvider>
            <CartProvider>
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
                        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}
