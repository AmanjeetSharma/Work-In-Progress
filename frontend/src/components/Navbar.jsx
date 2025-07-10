import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import defaultAvatar from "../assets/default-avatar.png";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaHome,
    FaUserPlus,
    FaSignInAlt,
    FaUser,
    FaChartLine,
    FaSignOutAlt,
    FaInfoCircle,
    FaEnvelope,
    FaBars,
    FaTimes
} from "react-icons/fa";
import NavButton from "./buttons/NavButton.jsx";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        setOpen(false);
        navigate("/");
    };

    const handleNavigation = (to) => {
        setIsTransitioning(true);
        setOpen(false);
        setMobileMenuOpen(false);
        setTimeout(() => {
            navigate(to);
            setIsTransitioning(false);
        }, 300);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setMobileMenuOpen(false);
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
                {isTransitioning && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: "0%" }}
                        exit={{ x: "-100%" }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 bg-indigo-500 z-50"
                    />
                )}
            </AnimatePresence>

            <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 py-4 z-40 bg-transparent">
                {/* Logo */}
                <motion.div
                    className="flex items-center"
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                >
                    <Link to="/" className="flex items-center space-x-2">
                        <motion.span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white drop-shadow-lg">
                            Work-in-Progress
                        </motion.span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-3">
                    <NavButton to="/" icon={<FaHome />}>
                        Home
                    </NavButton>

                    <NavButton to="/about" icon={<FaInfoCircle />}>
                        About Us
                    </NavButton>

                    <NavButton to="/contact" icon={<FaEnvelope />}>
                        Contact
                    </NavButton>

                    {!user && (
                        <>
                            <NavButton to="/register" icon={<FaUserPlus />}>
                                Sign Up
                            </NavButton>
                            <NavButton to="/login" icon={<FaSignInAlt />}>
                                Sign In
                            </NavButton>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <FaTimes className="w-6 h-6" />
                    ) : (
                        <FaBars className="w-6 h-6" />
                    )}
                </button>

                {/* User avatar & dropdown (Desktop) */}
                {user && (
                    <div className="hidden md:block relative" ref={dropdownRef}>
                        <motion.div
                            className="flex items-center space-x-2 cursor-pointer group"
                            onClick={() => setOpen((prev) => !prev)}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.4, type: "spring", stiffness: 120 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <motion.div
                                className="relative"
                                animate={open ? { rotate: 180 } : { rotate: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={user.avatar || defaultAvatar}
                                    alt="Avatar"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white group-hover:border-purple-200 transition-all duration-300"
                                />
                                <motion.div
                                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
                                    animate={open ? { scale: 1.3, backgroundColor: "#ff0000" } : { scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                            <motion.span className="font-semibold flex items-center text-white drop-shadow-md" style={{ userSelect: 'none' }}>
                                Hi, {user.name}
                                <motion.span
                                    className="ml-1"
                                    animate={open ? { rotate: 180 } : { rotate: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    ▼
                                </motion.span>
                            </motion.span>
                        </motion.div>

                        <AnimatePresence>
                            {open && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
                                    className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-20 overflow-hidden"
                                >
                                    <motion.div
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <Link
                                            to="/profile"
                                            onClick={() => handleNavigation("/profile")}
                                            className={`flex items-center px-4 py-3 transition-all duration-300 ${location.pathname === "/profile"
                                                ? "bg-blue-100 text-blue-600 font-medium"
                                                : "hover:bg-blue-100 hover:text-blue-600"
                                                }`}
                                        >
                                            <FaUser className="mr-2" />
                                            <motion.span
                                                whileHover={{ x: 4 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                Profile
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <Link
                                            to="/dashboard"
                                            onClick={() => handleNavigation("/dashboard")}
                                            className={`flex items-center px-4 py-3 transition-all duration-300 ${location.pathname === "/dashboard"
                                                ? "bg-purple-100 text-purple-600 font-medium"
                                                : "hover:bg-purple-100 hover:text-purple-600"
                                                }`}
                                        >
                                            <FaChartLine className="mr-2" />
                                            <motion.span
                                                whileHover={{ x: 4 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                Dashboard
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                    <motion.div
                                        initial={{ x: 20 }}
                                        animate={{ x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className={`flex items-center w-full text-left px-4 py-3 transition-all cursor-pointer duration-300 ${location.pathname === "/logout"
                                                ? "bg-red-100 text-red-600 font-medium"
                                                : "hover:bg-red-100 hover:text-red-600"
                                                }`}
                                        >
                                            <FaSignOutAlt className="mr-2" />
                                            <motion.span
                                                whileHover={{ x: 4 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                Logout
                                            </motion.span>
                                        </button>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Mobile Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            ref={mobileMenuRef}
                            initial={{ opacity: 0, x: '100%' }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="md:hidden fixed inset-0 bg-gray-900/95 backdrop-blur-lg z-30 pt-20 px-6"
                        >
                            <div className="flex flex-col space-y-6">
                                <NavButton
                                    to="/"
                                    icon={<FaHome />}
                                    onClick={() => handleNavigation("/")}
                                >
                                    Home
                                </NavButton>

                                <NavButton
                                    to="/about"
                                    icon={<FaInfoCircle />}
                                    onClick={() => handleNavigation("/about")}
                                >
                                    About Us
                                </NavButton>

                                <NavButton
                                    to="/contact"
                                    icon={<FaEnvelope />}
                                    onClick={() => handleNavigation("/contact")}
                                >
                                    Contact
                                </NavButton>

                                {!user ? (
                                    <>
                                        <NavButton
                                            to="/register"
                                            icon={<FaUserPlus />}
                                            onClick={() => handleNavigation("/register")}
                                        >
                                            Sign Up
                                        </NavButton>
                                        <NavButton
                                            to="/login"
                                            icon={<FaSignInAlt />}
                                            onClick={() => handleNavigation("/login")}
                                        >
                                            Sign In
                                        </NavButton>
                                    </>
                                ) : (
                                    <>
                                        <NavButton
                                            to="/profile"
                                            icon={<FaUser />}
                                            onClick={() => handleNavigation("/profile")}
                                        >
                                            Profile
                                        </NavButton>
                                        <NavButton
                                            to="/dashboard"
                                            icon={<FaChartLine />}
                                            onClick={() => handleNavigation("/dashboard")}
                                        >
                                            Dashboard
                                        </NavButton>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full text-white py-3 px-4 rounded-lg hover:bg-red-600/20 transition-colors"
                                        >
                                            <FaSignOutAlt className="mr-3" />
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>

                            {user && (
                                <div className="mt-8 pt-6 border-t border-gray-800 flex items-center">
                                    <img
                                        src={user.avatar || defaultAvatar}
                                        alt="Avatar"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                    />
                                    <div className="ml-3">
                                        <p className="font-semibold text-white">{user.name}</p>
                                        <p className="text-sm text-gray-400">{user.email}</p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
}