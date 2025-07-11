import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

export default function Modal({ isOpen, onClose, children, isLoading = false }) {
    // Disable background scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                type: "spring",
                                damping: 20,
                                stiffness: 300,
                                delay: 0.1
                            }
                        }}
                        exit={{
                            scale: 0.9,
                            opacity: 0,
                            transition: { ease: "easeIn" }
                        }}
                        className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-md relative mx-4 border border-gray-700"
                    >
                        <motion.button
                            onClick={onClose}
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.1 } : {}}
                            whileTap={!isLoading ? { scale: 0.95 } : {}}
                            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full 
                                bg-gray-700 hover:bg-red-600 transition-all duration-100 shadow-md
                                focus:outline-none focus:ring-2 focus:ring-gray-500 border border-white cursor-pointer
                                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                            aria-label="Close modal"
                        >
                            {isLoading ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                >
                                    <CgSpinner className="h-4 w-4 text-gray-300" />
                                </motion.div>
                            ) : (
                                <FiX className="h-4 w-4 text-gray-300" />
                            )}
                        </motion.button>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.2 }
                            }}
                        >
                            {children}
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
