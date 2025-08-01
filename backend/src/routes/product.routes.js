import express from "express";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createProduct,
    updateProduct,
    getAllProducts,
    getProductBySlug,
    deleteProduct,
    addOrUpdateReview,
    deleteReview,
    getProductReviews
} from "../controllers/product.controller.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);

// Protected routes
// Create product
router.post("/", verifyToken, authorizeRoles("ADMIN"), upload.fields([{ name: "productImages", maxCount: 3 }]), createProduct);
router.patch("/:productId", verifyToken, authorizeRoles("ADMIN"), upload.fields([{ name: "productImages", maxCount: 3 }]), updateProduct);
router.delete("/:productId", verifyToken, authorizeRoles("ADMIN"), deleteProduct);


// Review routes
router.post("/:slug/reviews", verifyToken, addOrUpdateReview);
router.delete("/:slug/reviews/delete", verifyToken, deleteReview);
router.get("/:slug/reviews", getProductReviews);

export default router;
