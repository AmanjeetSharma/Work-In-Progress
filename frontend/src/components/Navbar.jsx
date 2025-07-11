import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import defaultAvatar from "../assets/default-avatar.png";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUser,
    FaChartLine,
    FaInfoCircle,
    FaEnvelope,
    FaSignOutAlt,
    FaLock,
    FaBars,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaYoutube,
} from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { PiDotsThreeBold } from "react-icons/pi";
import Loader from "./loader/Loader.jsx";
import GradientText from "./Animations/GradientText.jsx";

export default function Navbar() {
    const {
        user,
        logout,
        navigationLoading,
        startNavigation,
        endNavigation
    } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const guestDropdownRef = useRef(null);

    const handleLogout = async () => {
        startNavigation();
        await logout();
        setOpen(false);
        navigate("/");
    };

    const handleNavigation = (to) => {
        startNavigation();
        setOpen(false);
        setMobileMenuOpen(false);
        navigate(to);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            endNavigation();
        }, 3000);

        return () => clearTimeout(timer);
    }, [location.pathname, endNavigation]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
            }
            if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <AnimatePresence>
                {navigationLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                    >
                        <Loader />
                    </motion.div>
                )}
            </AnimatePresence>

            <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 z-40 bg-transparent">
                {/* Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center space-x-2 cursor-pointer">
                        <GradientText>Work-in-Progress</GradientText>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-3">
                    {!user ? (
                        <div className="relative" ref={guestDropdownRef}>
                            <button
                                onClick={() => setOpen(!open)}
                                className="p-2 rounded-full hover:bg-gray-700 text-white focus:outline-none transition-all duration-300 hover:shadow-lg cursor-pointer"
                            >
                                <motion.div
                                    animate={open ? { rotate: 180, scale: 1.2 } : { rotate: 0, scale: 1 }}
                                    transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                >
                                    {open ? (
                                        <IoIosClose className="w-9 h-9" />
                                    ) : (
                                        <PiDotsThreeBold className="w-9 h-9" />
                                    )}
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20 overflow-hidden"
                                    >
                                        <div className="py-2">
                                            <button
                                                onClick={() => handleNavigation("/about")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer"
                                            >
                                                <FaInfoCircle className="text-lg pr-1" style={{ color: "#0096ff" }} />
                                                About Us
                                            </button>
                                            <button
                                                onClick={() => handleNavigation("/contact")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer"
                                            >
                                                <FaEnvelope className="text-lg pr-1" style={{ color: "#848c85" }} />
                                                Contact
                                            </button>
                                            <button
                                                onClick={() => handleNavigation("/login")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 bg-blue-100 text-slate-800 font-medium hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer"
                                            >
                                                <FaLock className="text-lg pr-1" style={{ color: "#dcb400" }} />
                                                Sign In
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-3 flex justify-center space-x-4">
                                            <a href="https://facebook.com" className="text-gray-500 hover:text-blue-600 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaFacebook />
                                            </a>
                                            <a href="https://twitter.com" className="text-gray-500 hover:text-blue-400 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaTwitter />
                                            </a>
                                            <a href="https://instagram.com" className="text-gray-500 hover:text-pink-600 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaInstagram />
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="relative" ref={dropdownRef}>
                            <motion.div
                                className="flex items-center space-x-2 cursor-pointer group"
                                onClick={() => setOpen((prev) => !prev)}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="relative">
                                    <img
                                        src={user.avatar || defaultAvatar}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-purple-200 transition-all duration-300 cursor-pointer"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                                </div>
                                <span className="font-semibold text-white drop-shadow-md cursor-pointer">
                                    Hi, {user.name}
                                </span>
                            </motion.div>

                            <AnimatePresence>
                                {open && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white text-black rounded-lg shadow-lg z-20 overflow-hidden cursor-pointer"
                                    >
                                        <div className="border-t border-gray-200 py-1">
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                User
                                            </div>
                                            <button
                                                onClick={() => handleNavigation("/profile")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer transition-colors"
                                            >
                                                <FaUser className="text-lg pr-1" style={{ color: "#00b894" }} />
                                                Profile
                                            </button>
                                            <button
                                                onClick={() => handleNavigation("/dashboard")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer transition-colors"
                                            >
                                                <FaChartLine className="text-lg pr-1" style={{ color: "#0984e3" }} />
                                                Dashboard
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-200 py-1">
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                Company
                                            </div>
                                            <button
                                                onClick={() => handleNavigation("/about")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer transition-colors"
                                            >
                                                <FaInfoCircle className="text-lg pr-1" style={{ color: "#0096ff" }} />
                                                About Us
                                            </button>
                                            <button
                                                onClick={() => handleNavigation("/contact")}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-slate-700 hover:text-white hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer transition-colors"
                                            >
                                                <FaEnvelope className="text-lg pr-1" style={{ color: "#848c85" }} />
                                                Contact
                                            </button>
                                        </div>

                                        <div className="border-t border-gray-200 py-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-200 hover:text-red-500 hover:border-l-1 hover:border-r-1 hover:border-white cursor-pointer transition-colors"
                                            >
                                                <FaSignOutAlt className="text-lg pr-1" style={{ color: "#ff7675" }} />
                                                Logout
                                            </button>
                                        </div>
                                        <div className="border-t border-gray-200 px-4 py-3 flex justify-center space-x-4">
                                            <a href="https://facebook.com" className="text-gray-500 hover:text-blue-600 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaFacebook />
                                            </a>
                                            <a href="https://twitter.com" className="text-gray-500 hover:text-blue-400 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaTwitter />
                                            </a>
                                            <a href="https://instagram.com" className="text-gray-500 hover:text-pink-600 cursor-pointer" target="_blank" rel="noopener noreferrer">
                                                <FaInstagram />
                                            </a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 focus:outline-none cursor-pointer"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <IoIosClose className="w-7 h-7 text-white" />
                    ) : (
                        <FaBars className="w-7 h-7 text-white" />
                    )}
                </button>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="md:hidden fixed top-0 right-0 h-full w-3/4 max-w-sm bg-gray-900/95 backdrop-blur-lg z-30 pt-20 px-6 shadow-2xl cursor-pointer overflow-y-auto"
                        >
                            {/* Close button for mobile menu */}
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="absolute top-4 right-4 text-white p-2 focus:outline-none"
                            >
                                <IoIosClose className="w-6 h-6 text-white" />
                            </button>

                            <div className="flex flex-col space-y-4">
                                {!user ? (
                                    <>
                                        <button
                                            onClick={() => handleNavigation("/about")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaInfoCircle className="text-lg" style={{ color: "#0096ff" }} />
                                            About Us
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("/contact")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaEnvelope className="text-lg" style={{ color: "#848c85" }} />
                                            Contact
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("/login")}
                                            className="flex items-center gap-3 text-left py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <FaLock className="text-lg" style={{ color: "#dcb400" }} />
                                            Sign In
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                                            <img
                                                src={user.avatar || defaultAvatar}
                                                alt="Avatar"
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                            />
                                            <div>
                                                <p className="font-semibold text-white">{user.name}</p>
                                                <p className="text-sm text-gray-400">{user.email}</p>
                                            </div>
                                        </div>

                                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Account
                                        </div>
                                        <button
                                            onClick={() => handleNavigation("/profile")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaUser className="text-lg" style={{ color: "#00b894" }} />
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("/dashboard")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaChartLine className="text-lg" style={{ color: "#0984e3" }} />
                                            Dashboard
                                        </button>

                                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Company
                                        </div>
                                        <button
                                            onClick={() => handleNavigation("/about")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaInfoCircle className="text-lg" style={{ color: "#0096ff" }} />
                                            About Us
                                        </button>
                                        <button
                                            onClick={() => handleNavigation("/contact")}
                                            className="flex items-center gap-3 text-left py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <FaEnvelope className="text-lg" style={{ color: "#848c85" }} />
                                            Contact
                                        </button>

                                        <div className="border-t border-gray-800 pt-2">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 text-left py-3 px-4 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <FaSignOutAlt className="text-lg" style={{ color: "#ff7675" }} />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <div className="flex justify-center space-x-6 py-4">
                                    <a href="https://facebook.com" className="text-gray-400 hover:text-white cursor-pointer" rel="noopener noreferrer" target="_blank">
                                        <FaFacebook className="w-5 h-5" />
                                    </a>
                                    <a href="https://twitter.com" className="text-gray-400 hover:text-white cursor-pointer" rel="noopener noreferrer" target="_blank">
                                        <FaTwitter className="w-5 h-5" />
                                    </a>
                                    <a href="https://instagram.com" className="text-gray-400 hover:text-white cursor-pointer" rel="noopener noreferrer" target="_blank">
                                        <FaInstagram className="w-5 h-5" />
                                    </a>
                                    {/* <a href="https://youtube.com" className="text-gray-400 hover:text-white cursor-pointer" rel="noopener noreferrer" target="_blank">
                                        <FaYoutube className="w-5 h-5" />
                                    </a> */}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}