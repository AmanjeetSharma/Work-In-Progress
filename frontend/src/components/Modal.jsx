import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

export default function Modal({ isOpen, onClose, children, isLoading = false }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative mx-4"
                    >
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className={`absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full 
                                bg-red-500 hover:bg-red-600 transition-colors duration-200 shadow-md
                                focus:outline-none focus:ring-2 focus:ring-red-300
                                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            aria-label="Close modal"
                        >
                            {isLoading ? (
                                <CgSpinner className="h-5 w-5 text-white animate-spin" />
                            ) : (
                                <FiX className="h-6 w-6 text-white" />
                            )}
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}