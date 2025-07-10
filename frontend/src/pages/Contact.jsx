import { motion } from "framer-motion";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function Contact() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        toast.success("Message sent successfully!");
        reset();
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.6
            }
        })
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-25 pb-15 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Contact <span className="text-indigo-400">Work-in-Progress</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        We'd love to hear from you! Get in touch with our team.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={0}
                            >
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={1}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={2}
                            >
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    {...register("message", { required: "Message is required" })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                                ></textarea>
                                {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                custom={3}
                            >
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </motion.div>
                        </form>
                    </motion.div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                            <div className="space-y-6">
                                <motion.div
                                    className="flex items-start"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={0}
                                >
                                    <div className="text-indigo-400 mt-1 mr-4">
                                        <FaEnvelope className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Email</h3>
                                        <p className="text-gray-400">amanjeetsharma01@gmail.com</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={1}
                                >
                                    <div className="text-indigo-400 mt-1 mr-4">
                                        <FaMapMarkerAlt className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Address</h3>
                                        <p className="text-gray-400">Jalandhar, Punjab, India</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-start"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={2}
                                >
                                    <div className="text-indigo-400 mt-1 mr-4">
                                        <FaPhone className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-white">Phone</h3>
                                        <p className="text-gray-400">+91 XXXXXXXXXX</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Business Hours</h2>
                            <div className="space-y-3 text-gray-400">
                                <motion.div
                                    className="flex justify-between"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={0}
                                >
                                    <span className="font-medium text-white">Monday - Friday</span>
                                    <span>9:00 AM - 6:00 PM</span>
                                </motion.div>
                                <motion.div
                                    className="flex justify-between"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={1}
                                >
                                    <span className="font-medium text-white">Saturday</span>
                                    <span>10:00 AM - 4:00 PM</span>
                                </motion.div>
                                <motion.div
                                    className="flex justify-between"
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={2}
                                >
                                    <span className="font-medium text-white">Sunday</span>
                                    <span>Closed</span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}