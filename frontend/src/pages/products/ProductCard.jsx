import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickView }) {
  const originalPrice = product.price;
  const discountedPrice = product.discount > 0
    ? Math.round(originalPrice * (1 - product.discount / 100))
    : originalPrice;

  return (
    <div className="w-full h-full p-2 group">
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-cyan-400/50 h-full flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden">
          {/* Discount Badge */}
          {product.discount > 0 && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm">
              {product.discount}% OFF
            </div>
          )}

          {/* Product Image */}
          <img
            src={product.images[0] || "https://via.placeholder.com/300"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white/90 hover:bg-white text-gray-900 font-medium py-2 px-4 rounded-full text-sm transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 shadow-md cursor-pointer"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-grow flex flex-col">
          {/* Brand */}
          <span className="text-xs text-cyan-600 dark:text-cyan-400 font-medium mb-1 overflow-hidden">
            {product.brand}
          </span>

          {/* Name */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1 min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating - Only show if rating exists */}
          {product.rating > 0 && (
            <div className="flex items-center mb-1">
              <div className="flex mr-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Price - Moved closer to name/rating */}
          <div className="mt-1">
            <div className="flex items-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ₹{discountedPrice.toLocaleString()}
              </span>
              {product.discount > 0 && (
                <span className="text-xs text-gray-500 dark:text-gray-400 line-through ml-2">
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* View Details Button */}
            <Link
              to={`/products/${product.slug}`}
              className="mt-2 block text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm py-2 rounded-lg transition-colors duration-200 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}