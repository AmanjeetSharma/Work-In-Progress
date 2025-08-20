import { useState } from "react";
import AIModal from "../components/aiModal.jsx";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Dashboard() {
    const [showAI, setShowAI] = useState(false);

    return (
        <div className="p-6 relative min-h-screen bg-slate-950 pt-30">
            <h1 className="text-5xl font-bold mb-4 text-blue-600 text-center">Dashboard</h1>

            <div className="fixed bottom-8 right-8 z-50">
                <div className="group relative">
                    <motion.button
                        onClick={() => setShowAI(true)}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        aria-label="Ask AI"
                    >
                        <Sparkles className="w-6 h-6 text-white group-hover:text-yellow-200 group-hover:scale-110 transition-transform duration-300" />
                    </motion.button>
                    <span
                        className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 origin-bottom scale-0 px-3 rounded-lg border border-gray-200 bg-white/90 backdrop-blur-sm py-1.5 text-sm font-semibold text-slate-700 shadow-md transition-all duration-300 group-hover:scale-100 cursor-pointer"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                        Ask Ai
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] w-2 h-2 bg-white/90 rotate-45 border-b border-r border-gray-200"></span>
                    </span>
                </div>
            </div>

            {showAI && <AIModal onClose={() => setShowAI(false)} />}
        </div>
    );
}