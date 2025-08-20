import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../context/AuthContext.jsx";
import ProductGallery from "./ProductGallery.jsx";
import ProductInfo from "./ProductInfo.jsx";
import ReviewSection from "./ReviewSection.jsx";
import Loader from "../../../components/loader/Loader.jsx"
import GoBackButton from "../../../components/buttons/GoBackButton.jsx"; // Importing the GoBackButton component

export default function ProductPage() {
    const { slug } = useParams();
    const { user, fetchProductBySlug, addOrUpdateReview, deleteReview, getAllReviews } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [productRating, setProductRating] = useState(0);
    const [reviewsCount, setReviewsCount] = useState(0);

    useEffect(() => {
        const loadProductAndReviews = async () => {
            try {
                // Load product
                const productData = await fetchProductBySlug(slug);
                setProduct(productData);

                // Load reviews
                const reviewsResponse = await getAllReviews(slug);
                if (reviewsResponse.success) {
                    setReviews(reviewsResponse.data.reviews);
                    setProductRating(reviewsResponse.data.rating);
                    setReviewsCount(reviewsResponse.data.reviewsCount);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProductAndReviews();
    }, [slug]);

    const handleReviewSubmit = async ({ rating, comment }) => {
        try {
            const response = await addOrUpdateReview(slug, rating, comment);
            if (response.success) {
                setReviews(response.data.reviews);
                setProductRating(response.data.rating);
                setReviewsCount(response.data.reviewsCount);
            }
        } catch (error) {
            console.error("Review submission failed:", error);
            // You might want to show an error toast here
        }
    };

    const handleReviewDelete = async (reviewId) => {
        try {
            const response = await deleteReview(slug, reviewId);
            if (response.success) {
                setReviews(response.data.reviews);
                setProductRating(response.data.rating);
                setReviewsCount(response.data.reviewsCount);
            }
        } catch (error) {
            console.error("Failed to delete review:", error);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <Loader />
        </div>;
    }

    if (error || !product) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
            <p className="text-white text-xl mb-4">{error || "Product not found"} 😢</p>
            <button onClick={() => navigate(-1)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                Go Back
            </button>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="min-h-screen bg-gray-900 text-white pt-26">
            <div className="container mx-auto px-4">
                <GoBackButton />
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <ProductGallery images={product.images} />
                    <ProductInfo
                        product={{
                            ...product,
                            rating: productRating,
                            reviewsCount
                        }}
                        reviews={reviews}
                    />
                </div>
            </div>

            <ReviewSection
                reviews={reviews}
                user={user}
                onReviewSubmit={handleReviewSubmit}
                onReviewDelete={handleReviewDelete}
            />
        </motion.div>
    );
}