import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ProductCard from "./ProductCard";
import Pagination from "./Pagination";
import ProductModal from "./ProductModal";

export default function AllProducts() {
  const { products, productsLoading, fetchProducts, totalPages } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 pt-20 pb-16 bg-slate-950 relative">
      {/* Background elements - moved behind navbar (z-0) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/5 via-slate-950 to-purple-900/5"></div>
      </div>

      {/* Header with higher z-index than navbar */}
      <div className="relative z-30 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-mono tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Store
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Browse our latest collection of products
        </p>
      </div>

      {/* Loading state */}
      {productsLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 bg-cyan-400 rounded-full opacity-50"
                style={{
                  animation: `bounce 1.2s infinite ${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Product grid - Updated for 4 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 relative z-20">
            {products.map((product) => (
              <div key={product._id} className="h-full transition-transform hover:scale-[1.02] duration-150">
                <ProductCard
                  product={product}
                  onQuickView={() => handleQuickView(product)}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="relative z-20 mt-8 sm:mt-10">
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        </>
      )}

      {/* Product Modal with higher z-index than navbar */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseModal}
      />
    </div>
  );
}