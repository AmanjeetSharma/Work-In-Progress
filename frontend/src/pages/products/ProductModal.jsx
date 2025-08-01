import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function ProductModal({ product, isOpen, onClose }) {
  const { addToCart, cartItems, isAuthenticated } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const navigate = useNavigate();

  // Check if product is already in cart
  const isInCart = cartItems?.some((item) => item.productId === product?._id) || false;

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

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product]);

  const showLoginToast = () => {
    toast.error("Please login to continue", {
      position: "bottom-left",
      duration: 4000,
      icon: "🔒",
    });

  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    setIsAdding(true);
    try {
      await addToCart(product._id, quantity);
      await fetchCart(); // Refresh cart after adding
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showLoginToast();
      return;
    }

    // setIsBuying(true);
    // try {
    //   if (!isInCart) {
    //     await addToCart(product._id, quantity);
    //   }
    //   onClose();
    //   navigate("/checkout");
    // } catch (error) {
    //   console.error("Error during buy now:", error);
    //   toast.error("Failed to proceed to checkout", {
    //     position: "top-right",
    //     autoClose: 2000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "colored",
    //   });
    // } finally {
    //   setIsBuying(false);
    // }
  };



  // const handleBuyNow = async () => {
  // }

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
                    className="text-gray-400 hover:text-white text-xl transition-colors cursor-pointer"
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

                {/* Quantity Selector */}
                <motion.div
                  className="flex items-center gap-4 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.85 }}
                >
                  <label className="text-slate-300">Quantity:</label>
                  <div className="flex items-center border border-slate-600 rounded-lg overflow-hidden">
                    <button
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-slate-800 text-white">
                      {quantity}
                    </span>
                    <button
                      className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <button
                    className={`w-full ${isInCart
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                      } text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-cyan-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2`}
                    onClick={handleAddToCart}
                    disabled={isAdding || isBuying}
                  >
                    {isAdding ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Adding...
                      </>
                    ) : isInCart ? (
                      "✓ Added to Cart"
                    ) : (
                      "Add to Cart"
                    )}
                  </button>

                  <button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-purple-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"

                    disabled={isAdding || isBuying}
                  >
                    {isBuying ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Buy Now"
                    )}
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