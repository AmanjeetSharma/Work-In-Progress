import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function ProductModal({ product, isOpen, onClose }) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0, backdropFilter: "blur(0px)" },
    visible: {
      opacity: 1,
      backdropFilter: "blur(8px)",
      transition: { duration: 0.3 },
    },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
        delay: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.3, duration: 0.5 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.4, duration: 0.5 },
    },
  };

  // Calculate discounted price
  const discountedPrice =
    product?.discount > 0 && product?.price
      ? Math.round(product.price * (1 - product.discount / 100))
      : product?.price;

  // Return null if no product is selected
  if (!product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-2xl z-40"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
          >
            <div
              className="w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <motion.div
                className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative"
                variants={imageVariants}
              >
                <img
                  src={product?.images?.[0] || "https://via.placeholder.com/500"}
                  alt={product?.name || "Product image"}
                  className="w-full h-full object-cover"
                />
                {product?.discount > 0 && (
                  <motion.div
                    className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                  >
                    {product.discount}% OFF
                  </motion.div>
                )}
              </motion.div>

              {/* Content */}
              <motion.div
                className="w-full md:w-1/2 p-6 overflow-y-auto"
                variants={contentVariants}
              >
                <div className="flex justify-between items-start mb-4">
                  <motion.h2
                    className="text-2xl font-bold text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {product?.name}
                  </motion.h2>
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white text-xl transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    ✕
                  </motion.button>
                </div>

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-cyan-400 font-bold text-2xl">
                      ₹{discountedPrice || "N/A"}
                    </p>
                    {product?.discount > 0 && (
                      <p className="text-gray-400 line-through text-lg">
                        ₹{product.price}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{product?.brand}</p>
                </motion.div>

                {product?.description && (
                  <motion.p
                    className="text-slate-300 text-sm mb-6 leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {product.description}
                  </motion.p>
                )}

                {/* Tags */}
                {product?.tags?.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {product.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="bg-slate-700/50 hover:bg-slate-700 text-cyan-400 text-xs px-3 py-1 rounded-full border border-slate-600 transition-colors cursor-default"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Add to cart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <button
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 active:scale-95"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
