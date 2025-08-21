import { useState } from "react";
import { FaStar, FaShoppingCart, FaHeart, FaShare } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { toast } from "react-hot-toast";

export default function ProductInfo({ product = {}, reviews = [] }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isAuthenticated } = useCart();
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Safely handle missing product properties
    const originalPrice = product.price || 0;
    const discount = product.discount || 0;
    const discountedPrice = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice;
    const rating = product.rating || 0;

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

        setIsAddingToCart(true);
        try {
            await addToCart(product._id, quantity);
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div className="lg:w-1/2">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{product.name || "Product Name"}</h1>
                <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={`star-${i}`}
                                className={`${i < rating ? 'text-yellow-400' : 'text-gray-500'} mr-1`}
                            />
                        ))}
                        <span className="text-sm ml-2">
                            {typeof rating === "number" ? rating.toFixed(1) : "N/A"}
                            ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                        </span>
                    </div>
                    <span className="text-green-400 text-sm">In Stock</span>
                </div>

                {/* Price Section */}
                <div className="mb-6">
                    {discount > 0 && (
                        <div className="flex items-center mb-2">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                                {discount}% OFF
                            </span>
                            <span className="text-gray-400 line-through text-lg">
                                ₹{originalPrice.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-cyan-400 mr-3">
                            ₹{discountedPrice.toLocaleString()}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-green-400">
                                You save ₹{(originalPrice - discountedPrice).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p className="text-gray-300">
                        {product.info || product.description || "No description available"}
                    </p>
                </div>

                {/* Features */}
                {product.features?.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Features</h2>
                        <ul className="list-disc list-inside text-gray-300 space-y-1">
                            {product.features.map((feature, index) => (
                                <li key={`feature-${index}`}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quantity</label>
                    <div className="flex items-center">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="bg-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                        >
                            -
                        </button>
                        <span className="bg-gray-800 px-4 py-1">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="bg-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className={`flex-1 ${isAddingToCart ? "bg-cyan-700" : "bg-cyan-600 hover:bg-cyan-700"
                            } text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center cursor-pointer`}
                        aria-label="Add to cart"
                    >
                        {isAddingToCart ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                        ) : (
                            <>
                                <FaShoppingCart className="mr-2" />
                                Add to Cart
                            </>
                        )}
                    </button>
                    <button
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        aria-label="Add to wishlist"
                        onClick={() => !isAuthenticated && showLoginToast()}
                    >
                        <FaHeart />
                    </button>
                    <button
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                        aria-label="Share product"
                    >
                        <FaShare />
                    </button>
                </div>

                {/* Tags */}
                {product.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                            <span
                                key={`tag-${tag}`}
                                className="bg-gray-800 text-cyan-400 text-xs px-3 py-1 rounded-full"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}