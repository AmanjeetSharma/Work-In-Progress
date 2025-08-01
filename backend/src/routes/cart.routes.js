import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyToken);

router.post("/add", addToCart);
router.get("/", getCart);
router.patch("/update/:productId", updateCartItem);
router.delete("/remove/:productId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
