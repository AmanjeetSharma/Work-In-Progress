import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiLock, FiCamera, FiArrowRight } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function Register() {
    const [form, setForm] = useState({ 
        username: "", 
        name: "", 
        email: "", 
        password: "", 
        avatar: null 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });
            await register(formData);
            toast.success("🎉 Registration successful! Please login.");
            navigate("/login");
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, avatar: file });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-16">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                            <p className="text-gray-400">Join our community today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="Password"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Profile Picture
                                    </label>
                                    <div className="flex items-center">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 border border-gray-600">
                                                <FiCamera className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <span className="text-sm text-gray-300">
                                                {form.avatar ? form.avatar.name : "Choose image"}
                                            </span>
                                            <input
                                                id="avatar"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                            >
                                <span>{loading ? "Creating Account..." : "Register"}</span>
                                {!loading && <FiArrowRight className="h-5 w-5" />}
                            </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-400">
                                Already have an account?{" "}
                                <button 
                                    onClick={() => navigate("/login")} 
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}