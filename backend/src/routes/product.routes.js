import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, updateProduct, getAllProducts, getProductBySlug, deleteProduct } from "../controllers/product.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Protected routes
// Create product
router.post(
    "/",
    verifyToken,
    authorizeRoles("ADMIN"),  // Only admin can create
    upload.fields([{ name: "productImages", maxCount: 3 }]),
    createProduct
);

// Update product
router.patch(
    "/:productId",
    verifyToken,
    authorizeRoles("ADMIN"),
    upload.fields([{ name: "productImages", maxCount: 3 }]),
    updateProduct
);

// Delete product
router.delete(
    "/:productId",
    verifyToken,
    authorizeRoles("ADMIN"),
    deleteProduct
);

export default router;
