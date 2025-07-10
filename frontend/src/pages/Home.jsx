import { motion } from "framer-motion";

const Home = () => {
  const features = [
    { icon: "🚀", title: "Fast Performance", description: "Lightning fast loading times" },
    { icon: "🎨", title: "Beautiful UI", description: "Modern, clean design" },
    { icon: "🔒", title: "Secure", description: "Built with security in mind" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen overflow-x-hidden bg-slate-950 pt-25"
    >
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.div
          className="text-center"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Welcome Home{" "}
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              👋
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Discover amazing features and build something incredible with our platform.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;