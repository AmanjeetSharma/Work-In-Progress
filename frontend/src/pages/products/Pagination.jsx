import { motion, AnimatePresence } from "framer-motion";

export default function Pagination({ currentPage, onPageChange, totalPages = 1 }) {
  // Build array of page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Animation variants for buttons
  const buttonVariants = {
    initial: { scale: 0.95, opacity: 0.7 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.05, y: -2 },
    active: { scale: 0.95 },
  };

  return (
    <div className="flex justify-center items-center mt-12 gap-1">
      {/* Previous Button */}
      <motion.button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="active"
        variants={buttonVariants}
        className="px-3 py-2 rounded-md bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-2">
        <AnimatePresence initial={false}>
          {pages.map((page) => (
            <motion.button
              key={page}
              onClick={() => onPageChange(page)}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="active"
              variants={buttonVariants}
              className={`px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                page === currentPage
                  ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {page}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        initial="initial"
        animate="animate"
        whileHover="hover"
        whileTap="active"
        variants={buttonVariants}
        className="px-3 py-2 rounded-md bg-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </motion.button>
    </div>
  );
}
