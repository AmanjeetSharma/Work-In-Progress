import { useCart } from "../../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaArrowLeft, FaShoppingBag, FaTimes } from "react-icons/fa";
import LoaderPage from "../../../components/loader/Loader";
import { useState } from "react";

const CartPage = () => {
    const {
        cart,
        totalPrice,
        updateQuantity,
        removeFromCart,
        isAuthenticated,
        cartLoading,
        clearCart
    } = useCart();

    const [isClearing, setIsClearing] = useState(false);
    const navigate = useNavigate();

    const handleClearCart = async () => {
        setIsClearing(true);
        try {
            await clearCart();
        } finally {
            setIsClearing(false);
        }
    };

    if (cartLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <LoaderPage />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 text-center pt-20 text-xl text-gray-300">
                Please login to view your cart.
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                <div className="bg-slate-900 p-8 rounded-xl shadow-lg max-w-md w-full">
                    <FaShoppingBag className="text-4xl text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold mb-4 text-gray-100">Your cart is empty!</h2>
                    <p className="text-gray-400 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition flex items-center justify-center gap-2 w-full cursor-pointer"
                        onClick={() => navigate("/accessories")}
                    >
                        <FaArrowLeft />
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 pt-26">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-3xl font-bold text-gray-100 flex items-center gap-3">
                            <FaShoppingBag className="text-blue-500" />
                            Cart
                        </h2>
                        <span className="bg-slate-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                            {cart.length} {cart.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    <button
                        onClick={handleClearCart}
                        disabled={isClearing}
                        className="relative flex items-center gap-2 text-sm bg-slate-800 px-4 py-2 rounded-xl text-gray-300 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer overflow-hidden group transition-all duration-300 border border-slate-700 hover:border-red-400/30"
                    >
                        {/* Animated background (only visible on hover) */}
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-0" />

                        {/* Button content with animation */}
                        <span className="relative z-10 flex items-center gap-2">
                            {isClearing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Clearing...
                                </span>
                            ) : (
                                <>
                                    <FaTimes className="transition-transform duration-300 group-hover:scale-125 group-hover:text-red-400" />
                                    <span className="group-hover:text-red-400 transition-colors duration-300">Clear Cart</span>
                                </>
                            )}
                        </span>

                        {/* Ripple effect (appears on click) */}
                        {!isClearing && (
                            <span className="absolute inset-0 scale-0 opacity-0 group-active:scale-100 group-active:opacity-30 transition-all duration-500 bg-red-400 rounded-xl" />
                        )}
                    </button>
                </div>

                <div className="space-y-4 mb-8">
                    {cart.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-4 rounded-lg shadow border border-slate-800 hover:border-slate-700 transition group"
                        >
                            <div className="flex items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
                                <img
                                    src={item.product?.images?.[0] || "https://via.placeholder.com/100"}
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-blue-400 font-medium">
                                        ₹{Number(item.product.price).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full sm:w-auto">
                                <div className="flex items-center gap-2 bg-slate-800 rounded-full p-1">
                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                        className="p-2 rounded-full hover:bg-slate-700 disabled:opacity-50 text-gray-300 cursor-pointer"
                                    >
                                        <FaMinus size={12} />
                                    </button>

                                    <span className="text-sm font-semibold text-gray-100 w-6 text-center">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        className="p-2 rounded-full hover:bg-slate-700 text-gray-300 cursor-pointer"
                                    >
                                        <FaPlus size={12} />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    className="ml-4 p-2 rounded-full hover:bg-slate-800 text-red-400 hover:text-red-300 transition cursor-pointer"
                                    title="Remove item"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-slate-900 rounded-xl p-6 shadow-lg border border-slate-800">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h3 className="text-sm text-gray-400 mb-1">Total Items</h3>
                            <p className="text-xl font-bold text-gray-100">
                                {cart.reduce((total, item) => total + item.quantity, 0)}
                            </p>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg">
                            <h3 className="text-sm text-gray-400 mb-1">Total Amount</h3>
                            <p className="text-xl font-bold text-blue-500">
                                ₹{Number(totalPrice).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => navigate("/accessories")}
                            className="flex-1 bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-3 px-6 rounded-lg transition font-medium flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <FaArrowLeft />
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate("#")}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition font-medium flex items-center justify-center gap-2 cursor-pointer"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;