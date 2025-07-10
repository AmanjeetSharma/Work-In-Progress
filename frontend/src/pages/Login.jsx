import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { osName, browserName, isMobile } from "react-device-detect";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const navigate = useNavigate();
    const { login, loginWithGoogle, forgotPassword } = useAuth();

    const getDeviceInfo = () => {
        if (isMobile) return "Mobile Device";
        return `${osName} - ${browserName} Browser`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login({ ...form, device: getDeviceInfo() });
            toast.success("🎉 Login successful!", { duration: 5000 });
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
            // toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const tokenId = credentialResponse.credential;
            const device = getDeviceInfo();
            await loginWithGoogle(tokenId, device);
            toast.success("🎉 Google login successful!", { duration: 5000 });
            navigate("/");
        } catch (err) {
            console.error("Google login failed:", err);
            toast.error("Google login failed. Please try again.");
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Sign In Failed");
    };

    const handleForgotSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword(forgotEmail);
            toast.success("Password reset email sent!");
            setIsForgotOpen(false);
            setForgotEmail("");
        } catch (err) {
            console.error("Forgot password failed:", err);
            toast.error("Failed to send reset email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome</h2>
                            <p className="text-gray-400">Sign in to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        placeholder="Email Address"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                                        placeholder="Password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setIsForgotOpen(true)}
                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                            >
                                <span>{loading ? "Signing In..." : "Sign In"}</span>
                                {!loading && <FiArrowRight className="h-5 w-5" />}
                            </motion.button>
                        </form>

                        <div className="my-6 flex items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink mx-4 text-gray-400">OR</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                useOneTap
                                theme="filled_blue"
                                size="large"
                                shape="pill"
                            />
                        </div>
                    </div>

                    <div className="px-8 py-4 bg-gray-900/50 text-center">
                        <p className="text-gray-400">
                            Don't have an account?{" "}
                            <button 
                                onClick={() => navigate("/register")} 
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <Modal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)}>
                <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-white mb-4">Reset Password</h2>
                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiMail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                            />
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            Send Reset Link
                        </motion.button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}