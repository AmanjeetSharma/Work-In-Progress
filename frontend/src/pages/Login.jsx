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
            navigate("/");
        } catch (err) {
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const tokenId = credentialResponse.credential;
            const device = getDeviceInfo();
            await loginWithGoogle(tokenId, device);
            navigate("/");
        } catch (err) {
            console.error("Google login failed:", err);
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 pt-16 sm:pt-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                    <div className="p-6 sm:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome</h2>
                            <p className="text-gray-400 text-sm sm:text-base">Sign in to access your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="space-y-3 sm:space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm sm:text-base"
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
                                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm sm:text-base"
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
                                    className="text-xs sm:text-sm text-blue-500 hover:text-white transition-colors cursor-pointer"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:shadow-lg transition-all text-sm sm:text-base cursor-pointer"
                            >
                                <span>{loading ? "Signing In..." : "Sign In"}</span>
                                {!loading && <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                            </motion.button>
                        </form>

                        <div className="my-4 sm:my-6 flex items-center">
                            <div className="flex-grow border-t border-gray-700"></div>
                            <span className="flex-shrink mx-3 sm:mx-4 text-gray-400 text-xs sm:text-sm">OR</span>
                            <div className="flex-grow border-t border-gray-700"></div>
                        </div>

                        <div className="flex justify-center">
                            <div className="scale-90 sm:scale-100">
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
                    </div>

                    <div className="px-6 sm:px-8 py-4 bg-gray-900/50 text-center">
                        <p className="text-gray-400 text-xs sm:text-sm">
                            Don't have an account?{" "}
                            <button 
                                onClick={() => navigate("/register")} 
                                className="text-blue-400 hover:text-white font-medium transition-colors cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <Modal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)}>
                <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-md w-full">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Reset Password</h2>
                    <form onSubmit={handleForgotSubmit} className="space-y-3 sm:space-y-4">
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
                                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm sm:text-base"
                            />
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 sm:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm sm:text-base"
                        >
                            Send Reset Link
                        </motion.button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}