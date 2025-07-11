import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Modal from "../components/Modal.jsx";
import defaultAvatar from "../assets/default-avatar.png";
import {
    FiCamera,
    FiChevronDown,
    FiLogOut,
    FiEdit2,
    FiKey,
    FiShield,
    FiTrash2,
    FiMonitor,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiAlertTriangle,
    FiMail,
} from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Profile() {
    const {
        user,
        updateProfile,
        deleteAccount,
        logout,
        changePassword,
        getSessions,
        logoutAllSessions,
        sendVerificationEmail,
    } = useAuth();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isPasswordOpen, setIsPasswordOpen] = useState(false);
    const [isSessionsOpen, setIsSessionsOpen] = useState(false);
    const [isLogoutAllOpen, setIsLogoutAllOpen] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [form, setForm] = useState({ name: "", username: "", avatarFile: null });
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const fileInputRef = useRef(null);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [isSendingVerification, setIsSendingVerification] = useState(false);

    const loadSessions = async () => {
        try {
            const data = await getSessions();
            setSessions(data);
        } catch (error) {
            throw "❌ Failed to load sessions: " + (error?.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (user) {
            loadSessions();
        }
    }, [user]);

    if (!user) return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-gray-700 h-12 w-12"></div>
                <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const openEdit = () => {
        setForm({ name: user.name, username: user.username, avatarFile: null });
        setIsEditOpen(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setForm({ ...form, avatarFile: e.target.files[0] });
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("username", form.username);
            if (form.avatarFile) {
                formData.append("avatar", form.avatarFile);
            }
            await updateProfile(formData);
            setIsEditOpen(false);
        } catch (error) {
            throw "❌ Failed to update profile: " + (error?.response?.data?.message || error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAccount();
            await logout();
        } catch (error) {
            throw "❌ Failed to delete account: " + (error?.response?.data?.message || error.message);
        }
    };

    const handleChangePassword = async (e) => {
        try {
            e.preventDefault();
            await changePassword(passwordForm);
            setIsPasswordOpen(false);
        } catch (error) {
            throw "❌ Failed to change password: " + (error?.response?.data?.message || error.message);
        }
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    };

    const handleLogoutAll = async () => {
        try {
            await logoutAllSessions();
            setIsLogoutAllOpen(false);
        } catch (error) {
            console.error("❌ Logout all error:", error);
        }
    };

    const getAvatarPreview = () => {
        if (form.avatarFile) {
            return URL.createObjectURL(form.avatarFile);
        }
        return user.avatar || defaultAvatar;
    };

    const handleSendVerification = async () => {
        setIsSendingVerification(true);
        try {
            const message = await sendVerificationEmail();
            setVerificationMessage(message);
            toast.success("Verification email sent...");
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Failed to send verification email");
        } finally {
            setIsSendingVerification(false);
        }
    };
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const bgColor = 'bg-slate-950';
    const cardBgColor = 'bg-gray-800';
    const headerBgColor = 'bg-gray-700';
    const borderColor = 'border-gray-700';
    const textColor = 'text-gray-100';
    const textSecondaryColor = 'text-gray-400';
    const buttonBgColor = 'bg-gray-700 hover:bg-gray-600';
    const inputBgColor = 'bg-gray-700';
    const inputBorderColor = 'border-gray-600';

    return (
        <div className={`min-h-screen ${bgColor} pt-25`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={containerVariants}
                    className={`${cardBgColor} rounded-lg shadow-sm border ${borderColor} overflow-hidden`}
                >
                    {/* Profile Header */}
                    <div className={`${headerBgColor} px-6 py-4 border-b ${borderColor}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <img
                                        src={user.avatar || defaultAvatar}
                                        alt="Avatar"
                                        className="w-16 h-16 rounded-full border-2 border-gray-600 shadow-sm"
                                    />
                                    <button
                                        onClick={openEdit}
                                        className="absolute bottom-0 right-0 bg-gray-600 hover:bg-gray-500 p-1 rounded-full transition"
                                        aria-label="Edit profile"
                                    >
                                        <FiEdit2 className="text-gray-200" size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h1 className={`text-xl font-semibold ${textColor}`}>{user.name}</h1>
                                    <p className={textSecondaryColor}>@{user.username}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* User Info */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div>
                                    <h2 className={`text-lg font-medium ${textColor} mb-2`}>Personal Information</h2>
                                    <div className="space-y-3">
                                        <div>
                                            <p className={`text-sm ${textSecondaryColor}`}>Full Name</p>
                                            <p className={textColor}>{user.name}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${textSecondaryColor}`}>Username</p>
                                            <p className={textColor}>@{user.username}</p>
                                        </div>
                                        <div>
                                            <p className={`text-sm ${textSecondaryColor}`}>Email</p>
                                            <div className="flex items-center gap-2">
                                                <p className={textColor}>{user.email}</p>
                                                {!user.isVerified ? (
                                                    <div className="flex items-center gap-2">
                                                        <span
                                                            className="text-red-500 flex items-center gap-1 cursor-pointer hover:underline"
                                                            onClick={handleSendVerification}
                                                        >
                                                            <FiXCircle size={14} />
                                                            Not Verified
                                                        </span>
                                                        {isSendingVerification && (
                                                            <span className="text-xs text-gray-400">Sending...</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-green-500 flex items-center gap-1">
                                                        <FiCheckCircle size={14} />
                                                        Verified
                                                    </span>
                                                )}
                                            </div>
                                            {verificationMessage && (
                                                <p className="text-xs text-blue-400 mt-1">{verificationMessage}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Actions */}
                            <motion.div variants={itemVariants} className="space-y-4">
                                <h2 className={`text-lg font-medium ${textColor} mb-2`}>Account Actions</h2>
                                <div className="space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={openEdit}
                                        className={`w-full flex items-center justify-between px-4 py-3 ${buttonBgColor} border ${borderColor} rounded-lg transition`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiEdit2 className={textColor} />
                                            <span className={textColor}>Edit Profile</span>
                                        </div>
                                        <FiChevronDown className={textSecondaryColor} />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsPasswordOpen(true)}
                                        className={`w-full flex items-center justify-between px-4 py-3 ${buttonBgColor} border ${borderColor} rounded-lg transition`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiKey className={textColor} />
                                            <span className={textColor}>Change Password</span>
                                        </div>
                                        <FiChevronDown className={textSecondaryColor} />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            loadSessions();
                                            setIsSessionsOpen(true);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 ${buttonBgColor} border ${borderColor} rounded-lg transition`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiMonitor className={textColor} />
                                            <span className={textColor}>Active Sessions</span>
                                        </div>
                                        <FiChevronDown className={textSecondaryColor} />
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsLogoutAllOpen(true)}
                                        className={`w-full flex items-center justify-between px-4 py-3 ${buttonBgColor} border ${borderColor} rounded-lg transition`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiLogOut className={textColor} />
                                            <span className={textColor}>Logout All Sessions</span>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsDeleteOpen(true)}
                                        className={`w-full flex items-center justify-between px-4 py-3 ${buttonBgColor} border border-red-700 rounded-lg hover:bg-red-900/20 transition text-red-400`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FiTrash2 />
                                            <span>Delete Account</span>
                                        </div>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Edit Modal */}
                    <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} darkMode={true}>
                        <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Edit Profile</h2>
                        <form onSubmit={handleUpdate} className="space-y-4" encType="multipart/form-data">
                            <div className="flex justify-center">
                                <div className="relative group">
                                    <img
                                        src={getAvatarPreview()}
                                        alt="Avatar Preview"
                                        className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-3 border-blue-600"
                                    />
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition"
                                        title="Change avatar"
                                    >
                                        <FiCamera className="text-white text-sm" />
                                    </button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="name" className={`block text-sm font-medium ${textSecondaryColor} mb-1`}>
                                    Name:
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className={`w-full px-3 py-2 border ${inputBorderColor} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBgColor} ${textColor}`}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className={`block text-sm font-medium ${textSecondaryColor} mb-1`}>
                                    Username:
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                    className={`w-full px-3 py-2 border ${inputBorderColor} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBgColor} ${textColor}`}
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium ${textColor} bg-gray-600 hover:bg-gray-500 rounded-md transition`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Sessions Modal */}
                    <Modal isOpen={isSessionsOpen} onClose={() => setIsSessionsOpen(false)} darkMode={true}>
                        <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Active Sessions</h2>
                        <div className="max-h-[60vh] overflow-y-auto">
                            {sessions.length > 0 ? (
                                <div className="space-y-3">
                                    {sessions.map((session) => (
                                        <div
                                            key={session.sessionId}
                                            className={`p-4 rounded-lg border ${session.isActive ?
                                                'border-green-800 bg-green-900/30' :
                                                borderColor}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start space-x-3">
                                                    <div className={`p-2 rounded-full ${session.isActive ?
                                                        'bg-green-800/50 text-green-400' :
                                                        'bg-gray-700 text-gray-400'}`}>
                                                        {session.isActive ? <FiCheckCircle size={18} /> : <FiXCircle size={18} />}
                                                    </div>
                                                    <div>
                                                        <p className={`font-medium ${textColor} flex items-center`}>
                                                            {session.device}
                                                            {session.isCurrent && (
                                                                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-900 text-blue-200">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className={`text-sm ${textSecondaryColor} flex items-center mt-1`}>
                                                            <FiClock className="mr-1" size={14} />
                                                            Last active: {new Date(session.latestLogin).toLocaleString()}
                                                        </p>
                                                        {session.ipAddress && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                IP: {session.ipAddress}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className={textSecondaryColor}>No active sessions found.</p>
                            )}
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setIsSessionsOpen(false)}
                                className={`px-4 py-2 text-sm font-medium ${textColor} bg-gray-600 hover:bg-gray-500 rounded-md transition`}
                            >
                                Close
                            </button>
                        </div>
                    </Modal>

                    {/* Logout All Confirmation Modal */}
                    <Modal isOpen={isLogoutAllOpen} onClose={() => setIsLogoutAllOpen(false)} darkMode={true}>
                        <div className="text-center">
                            <FiAlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
                            <h2 className={`text-xl font-semibold ${textColor} mt-3`}>Confirm Logout All Sessions</h2>
                            <p className={`mt-2 ${textSecondaryColor}`}>
                                Are you sure you want to log out of all active sessions? You'll need to log in again on all devices.
                            </p>
                        </div>
                        <div className="mt-5 sm:mt-6 space-y-3">
                            <button
                                onClick={handleLogoutAll}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition"
                            >
                                Yes, Logout All Sessions
                            </button>
                            <button
                                onClick={() => setIsLogoutAllOpen(false)}
                                className={`w-full inline-flex justify-center rounded-md border ${borderColor} shadow-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-base font-medium ${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition`}
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>

                    {/* Change Password Modal */}
                    <Modal isOpen={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} darkMode={true}>
                        <h2 className={`text-xl font-semibold ${textColor} mb-4`}>Change Password</h2>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label htmlFor="oldPassword" className={`block text-sm font-medium ${textSecondaryColor} mb-1`}>
                                    Current Password
                                </label>
                                <input
                                    id="oldPassword"
                                    type="password"
                                    placeholder="Current Password"
                                    value={passwordForm.oldPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                                    className={`w-full px-3 py-2 border ${inputBorderColor} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBgColor} ${textColor}`}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="newPassword" className={`block text-sm font-medium ${textSecondaryColor} mb-1`}>
                                    New Password
                                </label>
                                <input
                                    id="newPassword"
                                    type="password"
                                    placeholder="New Password"
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className={`w-full px-3 py-2 border ${inputBorderColor} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBgColor} ${textColor}`}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${textSecondaryColor} mb-1`}>
                                    Confirm New Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className={`w-full px-3 py-2 border ${inputBorderColor} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBgColor} ${textColor}`}
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordOpen(false)}
                                    className={`px-4 py-2 text-sm font-medium ${textColor} bg-gray-600 hover:bg-gray-500 rounded-md transition`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </Modal>

                    {/* Delete Modal */}
                    <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} darkMode={true}>
                        <div className="text-center">
                            <FiShield className="mx-auto h-12 w-12 text-red-500" />
                            <h2 className={`text-xl font-semibold ${textColor} mt-3`}>Confirm Account Deletion</h2>
                            <p className={`mt-2 ${textSecondaryColor}`}>
                                Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.
                            </p>
                        </div>
                        <div className="mt-5 sm:mt-6 space-y-3">
                            <button
                                onClick={handleDelete}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm transition"
                            >
                                Delete My Account
                            </button>
                            <button
                                onClick={() => setIsDeleteOpen(false)}
                                className={`w-full inline-flex justify-center rounded-md border ${borderColor} shadow-sm px-4 py-2 bg-gray-700 hover:bg-gray-600 text-base font-medium ${textColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition`}
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>
                </motion.div>
            </div>
        </div>
    );
}