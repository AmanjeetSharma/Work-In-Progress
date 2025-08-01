import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, "Quantity must be at least 1"],
            default: 1,
        },
        priceAtTime: {
            type: Number,
            required: true,
        },
        discountAtTime: {
            type: Number,
            default: 0,
        },
        finalPriceAtTime: {
            type: Number,
            required: true,
        }
    },
    { _id: false }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        items: [cartItemSchema],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        }
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;