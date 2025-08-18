import { useState, useEffect } from 'react';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaImage, FaStar } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-hot-toast';
import ProductPanelModal from './ProductPanelModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ProductsPanel = () => {
    const {
        products,
        productsLoading,
        fetchProducts,
        totalPages,
        deleteProduct
    } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [expandedProduct, setExpandedProduct] = useState(null);

    useEffect(() => {
        fetchProducts({ page: currentPage });
    }, [currentPage]);

    const handleDelete = async () => {
        try {
            await deleteProduct(productToDelete);
            toast.success('Product deleted successfully',{position: 'top-center'});
            fetchProducts({ page: currentPage });
            setShowDeleteModal(false);
        } catch (error) {
            toast.error('Failed to delete product',{position: 'top-center'});
        }
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setIsEditing(true);
        setShowAddModal(true);
    };

    const toggleExpandProduct = (productId) => {
        setExpandedProduct(expandedProduct === productId ? null : productId);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Fixed price formatting - no division by 100
    const formatPrice = (price) => {
        return price.toFixed(2);
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price - (discount || 0);
    };

    if (productsLoading) {
        return (
            <div className="p-6 flex justify-center items-center h-64 bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-slate-950 min-h-screen">
            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700"
                        >
                            <h3 className="text-lg font-medium text-slate-100 mb-4">Confirm Deletion</h3>
                            <p className="text-slate-300 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 rounded-md border border-slate-600 bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-100">Product Management</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-900 text-slate-100 placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => {
                            setSelectedProduct(null);
                            setIsEditing(false);
                            setShowAddModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                        <FaPlus className="text-sm" /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-slate-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-500">
                        <thead className="bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Brand/Model</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-slate-900 divide-y divide-slate-800">
                            {filteredProducts.map((product) => {
                                const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
                                const discountPercentage = product.discount;

                                return (
                                    <>
                                        <motion.tr
                                            key={product._id}
                                            className={`hover:bg-slate-800 ${expandedProduct === product._id ? 'bg-slate-800/50' : ''
                                                }`}
                                            onClick={() => toggleExpandProduct(product._id)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    {product.images?.length > 0 ? (
                                                        <div className="relative">
                                                            <img
                                                                src={product.images[0]}
                                                                alt={product.name}
                                                                className="w-12 h-12 object-cover rounded-lg"
                                                            />
                                                            {product.discount > 0 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                                    -{discountPercentage}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                            <FaImage className="text-slate-500 text-lg" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-medium text-slate-100">{product.name}</div>
                                                        <div className="text-xs text-slate-400 mt-1">
                                                            ID: {product._id.substring(0, 8)}...
                                                        </div>
                                                        {product.tags?.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {product.tags.slice(0, 2).map(tag => (
                                                                    <span key={tag} className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                                {product.tags.length > 2 && (
                                                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                                                                        +{product.tags.length - 2}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-100 font-medium">{product.brand || '-'}</div>
                                                <div className="text-xs text-slate-400">{product.model || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900/50 text-blue-300">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-slate-100">
                                                    ${formatPrice(discountedPrice)}
                                                </div>
                                                {product.discount > 0 && (
                                                    <div className="text-xs text-slate-400 line-through">
                                                        ${formatPrice(product.price)}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3 h-3 rounded-full ${product.stock === 0 ? 'bg-red-500' :
                                                        product.stock <= 5 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}></div>
                                                    <span className={`text-sm ${product.stock === 0 ? 'text-red-400' :
                                                        product.stock <= 5 ? 'text-yellow-400' : 'text-green-400'
                                                        }`}>
                                                        {product.stock}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(product);
                                                        }}
                                                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                                                        title="Edit"
                                                    >
                                                        <FaEdit className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setProductToDelete(product._id);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-400 hover:text-red-300 transition-colors duration-200 cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <FaTrash className="text-lg" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpandProduct(product._id);
                                                        }}
                                                        className="text-slate-400 hover:text-slate-300 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        {expandedProduct === product._id ? (
                                                            <FaChevronUp className="text-lg" />
                                                        ) : (
                                                            <FaChevronDown className="text-lg" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>

                                        <AnimatePresence>
                                            {expandedProduct === product._id && (
                                                <motion.tr
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <td colSpan="6" className="px-6 py-4 bg-slate-800/30 border-t border-slate-700 relative">
                                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>

                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            <div>
                                                                <h4 className="font-medium text-slate-200 mb-3 pb-2 border-b border-slate-700">Description</h4>
                                                                <p className="text-sm text-slate-300 whitespace-pre-line">{product.description || 'No description available'}</p>

                                                                <h4 className="font-medium text-slate-200 mt-6 mb-3 pb-2 border-b border-slate-700">AI Metadata</h4>
                                                                <div className="text-sm text-slate-300 space-y-2">
                                                                    <div>
                                                                        <span className="font-medium">Summary:</span>
                                                                        <p className="mt-1 bg-slate-700/50 p-3 rounded-lg">{product.aiMeta?.aiSummary || 'N/A'}</p>
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">AI Tags:</span>
                                                                        {product.aiMeta?.aiTags?.length > 0 ? (
                                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                                {product.aiMeta.aiTags.map(tag => (
                                                                                    <span key={tag} className="text-xs bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full">
                                                                                        {tag}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        ) : <span className="ml-2">N/A</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-slate-200 mb-3 pb-2 border-b border-slate-700">Details</h4>

                                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                                    <div>
                                                                        <h5 className="text-xs font-medium text-slate-400 uppercase mb-1">Rating</h5>
                                                                        <div className="flex items-center">
                                                                            <FaStar className="text-yellow-400 mr-1" />
                                                                            <span className="font-medium text-slate-100">
                                                                                {product.rating ? product.rating.toFixed(1) : 'No ratings'}
                                                                            </span>
                                                                            <span className="text-slate-400 text-sm ml-1">
                                                                                ({product.reviewsCount || 0} reviews)
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <h5 className="text-sm font-medium text-slate-200 mb-2">Specifications</h5>
                                                                {product.specs ? (
                                                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                                                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                                            {Object.entries(product.specs).map(([key, value]) => (
                                                                                <li key={key} className="flex">
                                                                                    <span className="text-slate-400 font-medium capitalize w-32 truncate">{key.replace(/_/g, ' ')}:</span>
                                                                                    <span className="text-slate-200 flex-1">{value}</span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-slate-500 italic">No specifications available</p>
                                                                )}

                                                                <div className="mt-4 text-xs text-slate-500 flex justify-between">
                                                                    <div>
                                                                        <span className="font-medium">Created:</span> {new Date(product.createdAt).toLocaleDateString()}
                                                                    </div>
                                                                    <div>
                                                                        <span className="font-medium">Updated:</span> {new Date(product.updatedAt).toLocaleDateString()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            )}
                                        </AnimatePresence>
                                    </>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredProducts.length === 0 && (
                    <div className="p-8 text-center">
                        <div className="text-slate-600 mb-4">
                            <FaSearch className="mx-auto text-4xl" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-200">No products found</h3>
                        <p className="text-slate-500 mt-1">Try adjusting your search or add a new product</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <nav className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Previous
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let page;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-1 rounded-md border ${currentPage === page
                                        ? 'bg-blue-600 border-blue-600 text-white'
                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                                        } transition-colors`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded-md border border-slate-700 bg-slate-800 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}

            {/* Product Modal */}
            {showAddModal && (
                <ProductPanelModal
                    product={selectedProduct}
                    isEditing={isEditing}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        fetchProducts({ page: currentPage });
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default ProductsPanel;