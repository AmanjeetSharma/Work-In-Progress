import { motion } from "framer-motion";
import { ShoppingCart, ArrowUp } from "lucide-react";
import TorchButton from "../components/animations/torchBtn/TorchButton";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-slate-950 overflow-hidden relative flex items-center justify-center"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 z-0"></div>

      {/* Stars */}
      <div className="absolute inset-0 z-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-6 max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="leading-snug font-extrabold text-white drop-shadow-lg mb-8"
        >
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Welcome</div>
          <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">to</div>
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            NEXTxLoadOut
          </div>
        </motion.div>




        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-12"
        >
          Discover the future of gaming technology
        </motion.p>

        {/* Bloom effect behind the button */}
        <motion.div
          className="absolute inset-0 flex items-end justify-center pb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="relative w-64 h-24 flex items-center justify-center">
            <div className="absolute w-50 h-50 rounded-full bg-purple-500/20 blur-2xl animate-pulse"></div>
            <div className="absolute w-32 h-32 rounded-full bg-pink-500/15 blur-xl"></div>
          </div>
        </motion.div>

        {/* Animated arrow pointing to button */}
        <motion.div
          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-white mb-1"
          >
            <ArrowUp size={24} />
          </motion.div>
          <motion.span
            className="text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Explore now
          </motion.span>
        </motion.div>

        {/* Single Shop Now Button with TorchButton Animation */}
        <motion.div
          className="flex justify-center relative z-30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div
            className="cursor-pointer"
            onClick={() => window.location.href = "/accessories"}
          >
            <TorchButton text="Shop Now" icon={<ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;