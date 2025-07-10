import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const ResetPassword = () => {
    const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get token from query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await resetPassword({
                token,
                newPassword: form.newPassword,
                confirmPassword: form.confirmPassword,
            });
            navigate("/login");
        } catch (err) {
            console.error("Reset password error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-screen px-4"
        >
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
            >
                <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

                <input
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="New Password"
                    type="password"
                    required
                    value={form.newPassword}
                    onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                />

                <input
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Confirm New Password"
                    type="password"
                    required
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </motion.div>
    );
};

export default ResetPassword;
