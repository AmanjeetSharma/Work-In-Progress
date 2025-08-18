import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// 🔧 Helper to format cart response
const formatCartResponse = (cart) => ({
    items: cart.items.map(item => ({
        ...item.toObject(),
        subtotal: item.finalPriceAtTime * item.quantity
    })),
    totalAmount: cart.totalAmount
});





const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
        throw new ApiError(400, "Invalid product or quantity");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({
            user: userId,
            username: req.user.username,
            items: [],
            totalAmount: 0
        });
    }

    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );

    const finalPrice = product.price * (1 - product.discount / 100);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
        cart.items[itemIndex].priceAtTime = product.price;
        cart.items[itemIndex].discountAtTime = product.discount;
        cart.items[itemIndex].finalPriceAtTime = finalPrice;
    } else {
        cart.items.push({
            product: product._id,
            quantity,
            priceAtTime: product.price,
            discountAtTime: product.discount,
            finalPriceAtTime: finalPrice
        });
    }

    cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.finalPriceAtTime * item.quantity,
        0
    );

    await cart.save();
    await cart.populate("items.product");


    return res.status(200).json(
        new ApiResponse(200, formatCartResponse(cart), "Product added to cart successfully")
    );
});














const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, {
                items: [],
                totalAmount: 0
            }, "Cart is empty")
        );
    }

    return res.status(200).json(
        new ApiResponse(200, formatCartResponse(cart), "Cart fetched successfully")
    );
});













const updateCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!productId || quantity < 1) {
        throw new ApiError(400, "Invalid product or quantity");
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    const item = cart.items.find(
        (item) => item.product.toString() === productId
    );

    if (!item) throw new ApiError(404, "Product not in cart");

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.finalPriceAtTime * item.quantity,
        0
    );

    await cart.save();
    await cart.populate("items.product");


    return res.status(200).json(
        new ApiResponse(200, formatCartResponse(cart), "Cart updated")
    );
});











const removeCartItem = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId
    );

    cart.totalAmount = cart.items.reduce(
        (acc, item) => acc + item.finalPriceAtTime * item.quantity,
        0
    );

    await cart.save();
    await cart.populate("items.product");


    return res.status(200).json(
        new ApiResponse(200, formatCartResponse(cart), "Item removed from cart")
    );
});












const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new ApiError(404, "Cart not found");

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    return res.status(200).json(
        new ApiResponse(200, {
            items: [],
            totalAmount: 0
        }, "Cart cleared")
    );
});









export {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
};
