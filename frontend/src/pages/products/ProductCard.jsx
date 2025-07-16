import { Link } from "react-router-dom";

export default function ProductCard({ product, onQuickView }) {
  // Calculate the original price and discounted price
  const originalPrice = product.price;
  const discountedPrice = product.discount > 0
    ? Math.round(originalPrice * (1 - product.discount / 100))
    : originalPrice;

  return (
    <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 hover:border-cyan-400/50 transition-all duration-200 hover:shadow-md hover:shadow-cyan-500/10 relative group hover:-translate-y-[3px] active:scale-[0.98]">
      {/* Discount badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] xs:text-xs font-bold px-1.5 xs:px-2 py-0.5 rounded-full z-10">
          {product.discount}% OFF
        </div>
      )}

      {/* Product image with click handler */}
      <div
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.images[0] || "https://via.placeholder.com/300"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-150"
          loading="lazy"
        />

        {/* Quick View button */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-150 transition-opacity duration-300 flex items-end p-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-1.5 px-3 rounded text-sm xs:text-base transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm xs:text-base font-semibold text-white truncate">
              {product.name}
            </h2>
            <p className="text-gray-400 text-xs xs:text-sm truncate">
              {product.brand}
            </p>
          </div>
          {product.rating > 0 && (
            <div className="flex items-center bg-gray-800/80 px-1.5 py-0.5 rounded text-xs">
              <svg className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white">{product.rating}</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-cyan-400 font-bold text-sm xs:text-base">
              ₹{discountedPrice}
            </span>
            {product.discount > 0 && (
              <span className="text-gray-400 text-xs line-through ml-1.5">
                ₹{originalPrice}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="hidden xs:flex space-x-1">
            {product.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="bg-gray-800/80 text-cyan-400 text-[10px] px-1.5 py-0.5 rounded-full truncate max-w-[60px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* View Details link */}
        <Link
          to={`/products/${product.slug}`}
          className="mt-2 block text-center bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs py-1 rounded transition"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}