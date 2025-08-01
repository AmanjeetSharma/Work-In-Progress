import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [cartLoading, setCartLoading] = useState(false);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
            setTotalPrice(0);
            setCartCount(0);
        }
    }, [user]);

    const updateCartState = (cartData) => {
        const cartItems = cartData?.items || [];
        const total = cartData?.totalAmount || 0;
        setCart(cartItems);
        setTotalPrice(total);
        setCartCount(cartItems.reduce((sum, item) => sum + item.quantity, 0));
    };


    const fetchCart = useCallback(async () => {
        try {
            setCartLoading(true);
            const res = await axiosInstance.get("/cart");
            updateCartState(res.data.data || res.data); // Handle both structures
        } catch (err) {
            console.error("Error fetching cart:", err);
        } finally {
            setCartLoading(false);
        }
    }, []);

    const addToCart = async (productId, quantity = 1) => {
        try {
            const res = await axiosInstance.post("/cart/add", { productId, quantity });
            updateCartState(res.data.data);
            toast.success("Item added to cart", { position: "top-center", icon: "🛒" });
        } catch (err) {
            console.error("Error adding to cart:", err);
            toast.error("Failed to add item to cart", { position: "top-center", icon: "❌" });
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            const res = await axiosInstance.patch(`/cart/update/${productId}`, { quantity });
            updateCartState(res.data.data); // Pass full cart object
            toast.success("Item quantity updated", { position: "top-center" });
        } catch (err) {
            console.error("Error updating quantity:", err);
            toast.error("Failed to update item quantity", { position: "top-center", icon: "❌" });
        }
    };


    const removeFromCart = async (productId) => {
        try {
            const res = await axiosInstance.delete(`/cart/remove/${productId}`);
            updateCartState(res.data.data);
            toast.success("Item removed from cart", { position: "top-center", icon: "🗑️" });
        } catch (err) {
            console.error("Error removing item:", err);
            toast.error("Failed to remove item from cart", { position: "top-center", icon: "❌" });
        }
    };

    const clearCart = async () => {
        try {
            await axiosInstance.delete("/cart/clear");
            setCart([]);
            setTotalPrice(0);
            setCartCount(0);
            toast.success("Cart cleared", { position: "top-center", icon: "🗑️" });
        } catch (err) {
            console.error("Error clearing cart:", err);
            toast.error("Failed to clear cart", { position: "top-center" });
        }
    };

    const isAuthenticated = Boolean(user?._id);

    return (
        <CartContext.Provider
            value={{
                cart,
                totalPrice,
                cartCount,
                cartLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                fetchCart,
                isAuthenticated,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
