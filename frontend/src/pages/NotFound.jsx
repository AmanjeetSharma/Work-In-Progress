import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const floatingOrbs = [
        { color: "bg-purple-500", size: "w-16 h-16", delay: 0 },
        { color: "bg-blue-500", size: "w-24 h-24", delay: 0.5 },
        { color: "bg-pink-500", size: "w-20 h-20", delay: 1 },
        { color: "bg-yellow-500", size: "w-28 h-28", delay: 1.5 },
    ];

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden flex items-center justify-center">
            {/* Floating orbs */}
            {floatingOrbs.map((orb, index) => (
                <motion.div
                    key={index}
                    className={`absolute rounded-full filter blur-xl opacity-20 ${orb.color} ${orb.size}`}
                    initial={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                    }}
                    animate={{
                        x: [null, Math.random() * 200 - 100],
                        y: [null, Math.random() * 200 - 100],
                    }}
                    transition={{
                        duration: 20 + Math.random() * 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: orb.delay
                    }}
                />
            ))}

            <motion.div
                className="text-center relative z-10 p-8 max-w-4xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="mb-12"
                    variants={itemVariants}
                >
                    <motion.h1
                        className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4"
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.9, 1, 0.9]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        className="text-4xl font-bold text-white mb-6"
                        variants={itemVariants}
                    >
                        Lost in the Digital Void
                    </motion.h2>

                    <motion.p
                        className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                        variants={itemVariants}
                    >
                        The page you're looking for has vanished into the ether. Maybe it never existed, or perhaps it's hiding in another dimension.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="flex flex-wrap justify-center gap-6"
                    variants={containerVariants}
                >
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Go Back
                    </motion.button>

                    <motion.button
                        onClick={() => navigate("/")}
                        className="px-8 py-3 rounded-full bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Return Home
                    </motion.button>
                </motion.div>

                <motion.div
                    className="mt-20"
                    variants={itemVariants}
                >
                    <div className="flex justify-center space-x-4">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className={`w-3 h-3 rounded-full ${i === 2 ? 'bg-pink-500' : 'bg-gray-500'}`}
                                animate={{
                                    y: [0, -15, 0],
                                    opacity: [0.6, 1, 0.6],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                    <p className="text-gray-400 mt-4">Searching for missing dimensions...</p>
                </motion.div>
            </motion.div>

            {/* Animated astronaut */}
            <motion.div
                className="absolute right-10 bottom-10"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                >
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z" />
                </svg>
            </motion.div>
        </div>
    );
};

export default NotFound;