import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaTimes, FaSearchPlus } from "react-icons/fa";

export default function ProductGallery({ images }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile devices
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Handle keyboard events
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            } else if (isModalOpen && !isMobile) {
                if (e.key === 'ArrowRight') {
                    nextImage();
                } else if (e.key === 'ArrowLeft') {
                    prevImage();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen, selectedImage, isMobile]);

    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % images.length);
        setZoomLevel(1);
    };

    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
        setZoomLevel(1);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setZoomLevel(1);
    };

    const handleZoom = () => {
        if (isMobile) return; // Disable zoom on mobile
        setZoomLevel(prev => prev === 1 ? 2 : 1);
    };

    // Handle swipe gestures for mobile
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextImage();
        } else if (touchEnd - touchStart > 50) {
            prevImage();
        }
    };

    return (
        <div className="w-full lg:w-1/2 relative">
            {/* Main Image Container - Responsive Height */}
            <div
                className="bg-gray-800 rounded-xl overflow-hidden mb-4 relative"
                style={{ height: isMobile ? '300px' : '500px' }}
                onClick={openModal}
            >
                <img
                    src={images[selectedImage]}
                    alt="Product"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full">
                    <FaSearchPlus className="text-white" />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft className="text-white" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all cursor-pointer"
                            aria-label="Next image"
                        >
                            <FaChevronRight className="text-white" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails - Horizontal scroll on mobile */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-hide">
                    {images.map((image, index) => (
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
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                className="text-white text-xl p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 transition-all"
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 md:p-4 rounded-full hover:bg-opacity-70 transition-all text-white text-xl z-10"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 p-3 md:p-4 rounded-full hover:bg-opacity-70 transition-all text-white text-xl z-10"
                                    aria-label="Next image"
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
                            className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            {/* Responsive container for the image */}
                            <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={images[selectedImage]}
                                    alt="Product"
                                    className={`max-w-full max-h-full object-contain transition-transform duration-300 ${zoomLevel === 2 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        touchAction: isMobile ? 'pan-y' : 'none'
                                    }}
                                    onClick={handleZoom}
                                />
                            </div>

                            {/* Only show instructions on desktop */}
                            {!isMobile && (
                                <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
                                    {images.length > 1 && (
                                        <span className="mr-4">← → to navigate</span>
                                    )}
                                    <span className="mr-4">Click to {zoomLevel === 1 ? 'zoom in' : 'zoom out'}</span>
                                    <span>ESC to close</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}