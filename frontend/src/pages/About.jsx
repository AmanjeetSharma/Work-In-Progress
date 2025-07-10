import { motion } from "framer-motion";
import { FaLightbulb, FaUsers, FaRocket } from "react-icons/fa";

export default function About() {
    const cardVariants = {
        offscreen: {
            y: 50,
            opacity: 0
        },
        onscreen: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                bounce: 0.4,
                duration: 0.8
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-25 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About <span className="text-indigo-400">Work-in-Progress</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Innovating the future of project management and collaboration
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <motion.div
                        variants={cardVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, margin: "-100px" }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
                    >
                        <div className="text-indigo-400 mb-4">
                            <FaLightbulb className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
                        <p className="text-gray-400">
                            To revolutionize how teams collaborate and manage projects by providing intuitive, powerful tools that adapt to your workflow.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
                    >
                        <div className="text-indigo-400 mb-4">
                            <FaUsers className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Team</h3>
                        <p className="text-gray-400">
                            A passionate group of developers, designers, and product experts dedicated to creating exceptional user experiences.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={cardVariants}
                        initial="offscreen"
                        whileInView="onscreen"
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
                    >
                        <div className="text-indigo-400 mb-4">
                            <FaRocket className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Our Journey</h3>
                        <p className="text-gray-400">
                            From startup to industry innovator, we've been helping teams achieve more since 2023.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="bg-gray-800 rounded-xl shadow-lg p-8 max-w-4xl mx-auto border border-gray-700"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
                    <div className="space-y-4 text-gray-400">
                        <p>
                            Work-in-Progress was founded in Jalandhar, Punjab with a simple mission: to make project management effortless and enjoyable.
                        </p>
                        <p>
                            Frustrated with clunky, overcomplicated tools, our team set out to build a platform that combines powerful features with an intuitive interface.
                        </p>
                        <p>
                            Today, we serve thousands of happy customers worldwide, from freelancers to Fortune 500 companies, all united by their desire to work smarter.
                        </p>
                        <p className="font-medium text-indigo-400">
                            Our work is always in progress as we continue to innovate and improve based on your feedback.
                        </p>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}