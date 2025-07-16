import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";
import { FaStar, FaChevronLeft, FaShoppingCart, FaHeart, FaShare, FaChevronRight, FaTimes, FaSearchPlus } from "react-icons/fa";

export default function ProductPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { fetchProductBySlug } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const productData = await fetchProductBySlug(slug);
                setProduct(productData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [slug, fetchProductBySlug]);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % product.images.length);
        setZoomLevel(1);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
        setZoomLevel(1);
    };

    const openModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleZoom = (e) => {
        setZoomLevel(prev => prev === 1 ? 2 : 1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950">
                <p className="text-white text-xl mb-4">{error || "Product not found"}</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Calculate prices
    const originalPrice = product.price;
    const discountedPrice = product.discount > 0
        ? Math.round(originalPrice * (1 - product.discount / 100))
        : originalPrice;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-900 text-white"
        >
            {/* Navigation */}
            <div className="container mx-auto px-4 py-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-6"
                >
                    <FaChevronLeft className="mr-2" />
                    Back to Shop
                </button>
            </div>

            {/* Product Main Section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Product Images */}
                    <div className="lg:w-1/2 relative">
                        <div 
                            className="bg-gray-800 rounded-xl overflow-hidden mb-4 relative cursor-zoom-in"
                            onClick={openModal}
                        >
                            <img
                                src={product.images[selectedImage] || "https://via.placeholder.com/800"}
                                alt={product.name}
                                className="w-full h-auto max-h-[500px] object-contain"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full">
                                <FaSearchPlus className="text-white" />
                            </div>
                            
                            {/* Navigation arrows - only show if more than one image */}
                            {product.images.length > 1 && (
                                <>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            prevImage();
                                        }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <FaChevronLeft className="text-white" />
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            nextImage();
                                        }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    >
                                        <FaChevronRight className="text-white" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery - only show if more than one image */}
                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto py-2">
                                {product.images.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-cyan-400' : 'border-transparent'}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info - RESTORED SECTION */}
                    <div className="lg:w-1/2">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                            <div className="flex items-center mb-4">
                                <div className="flex items-center mr-4">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`${i < product.rating ? 'text-yellow-400' : 'text-gray-500'} mr-1`}
                                        />
                                    ))}
                                    <span className="text-sm ml-2">({product.reviewCount} reviews)</span>
                                </div>
                                <span className="text-green-400 text-sm">In Stock</span>
                            </div>

                            {/* Price Section */}
                            <div className="mb-6">
                                {product.discount > 0 && (
                                    <div className="flex items-center mb-2">
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-3">
                                            {product.discount}% OFF
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
                                    {product.discount > 0 && (
                                        <span className="text-sm text-green-400">
                                            You save ₹{(originalPrice - discountedPrice).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-300">{product.description}</p>
                            </div>

                            {/* Features/Specs */}
                            {product.features?.length > 0 && (
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">Features</h2>
                                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                                        {product.features.map((feature, index) => (
                                            <li key={index}>{feature}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Quantity Selector */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="bg-gray-700 px-3 py-1 rounded-l-lg hover:bg-gray-600 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="bg-gray-800 px-4 py-1">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="bg-gray-700 px-3 py-1 rounded-r-lg hover:bg-gray-600 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-8">
                                <button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
                                    <FaShoppingCart className="mr-2" />
                                    Add to Cart
                                </button>
                                <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                    <FaHeart />
                                </button>
                                <button className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                                    <FaShare />
                                </button>
                            </div>

                            {/* Tags */}
                            {product.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="bg-gray-800 text-cyan-400 text-xs px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <button 
                            className="absolute top-4 right-4 text-white text-2xl p-2"
                            onClick={closeModal}
                        >
                            <FaTimes />
                        </button>
                        
                        {/* Navigation arrows in modal - only show if more than one image */}
                        {product.images.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-full hover:bg-opacity-70 transition-all text-white text-xl"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-4 rounded-full hover:bg-opacity-70 transition-all text-white text-xl"
                                >
                                    <FaChevronRight />
                                </button>
                            </>
                        )}
                        
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative max-w-full max-h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="max-w-full max-h-[90vh] object-contain"
                                style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                                onClick={handleZoom}
                            />
                            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                                Click to {zoomLevel === 1 ? 'zoom in' : 'zoom out'}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}