import { useState } from 'react';
import { FaTimes, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiImage } from 'react-icons/fi';

const ProductPanelModal = ({ product, isEditing, onClose, onSuccess }) => {
    const { createProduct, updateProduct } = useAuth();
    const [formData, setFormData] = useState({
        name: product?.name || '',
        brand: product?.brand || '',
        model: product?.model || '',
        category: product?.category || '',
        price: product?.price || '',
        discount: product?.discount || 0,
        description: product?.description || '',
        tags: product?.tags?.join(', ') || '',
        searchKeywords: product?.searchKeywords?.join(', ') || '',
        stock: product?.stock || 0,
        specs: product?.specs || {},
    });

    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSpecsChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specs: { ...prev.specs, [name]: value }
        }));
    };

    const addNewSpec = () => {
        if (newSpecKey.trim() && newSpecValue.trim()) {
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [newSpecKey.trim()]: newSpecValue.trim() }
            }));
            setNewSpecKey('');
            setNewSpecValue('');
        }
    };

    const removeSpec = (key) => {
        const newSpecs = { ...formData.specs };
        delete newSpecs[key];
        setFormData(prev => ({ ...prev, specs: newSpecs }));
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files).slice(0, 5); // Increased to 5 images
            setImages(files);
        }
    };

    const removeImage = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const productData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                searchKeywords: formData.searchKeywords.split(',').map(kw => kw.trim()),
            };

            if (isEditing && product) {
                await updateProduct(product._id, productData, images);
                toast.success('Product updated successfully', { position: 'top-center' });
            } else {
                await createProduct(productData, images);
                toast.success('Product created successfully', { position: 'top-center' });
            }
            onSuccess();
        } catch (error) {
            toast.error(error.message || 'Something went wrong', { position: 'top-center' });
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const modalVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    const inputVariants = {
        focus: {
            scale: 1.01,
            boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.5)",
            transition: { duration: 0.2 }
        },
        blur: {
            scale: 1,
            boxShadow: "none",
            transition: { duration: 0.1 }
        }
    };

    const buttonHover = {
        scale: 1.03,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
    };

    const buttonTap = {
        scale: 0.98,
        transition: { type: 'spring', stiffness: 400, damping: 10 }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-50 overflow-y-auto"
            >
                <div className="min-h-screen flex items-center justify-center p-4">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-slate-800"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
                            <motion.h2 
                                className="text-2xl font-bold text-slate-100"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {isEditing ? 'Edit Product' : 'Create New Product'}
                            </motion.h2>
                            <motion.button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
                                whileHover={{ rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FaTimes className="text-xl" />
                            </motion.button>
                        </div>

                        <div className="overflow-y-auto max-h-[70vh] p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <motion.section 
                                    variants={sectionVariants}
                                    transition={{ delay: 0.2 }}
                                    className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50"
                                >
                                    <h3 className="text-xl font-semibold text-slate-200 mb-6 pb-2 border-b border-slate-700">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Product Name*', name: 'name', required: true },
                                            { label: 'Brand*', name: 'brand', required: true },
                                            { label: 'Model', name: 'model' },
                                            { label: 'Category*', name: 'category', required: true },
                                        ].map((field) => (
                                            <motion.div 
                                                key={field.name}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                                    {field.label}
                                                </label>
                                                <motion.input
                                                    type="text"
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                                                    required={field.required}
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                />
                                            </motion.div>
                                        ))}

                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.35 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Price*</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-slate-400">$</span>
                                                <motion.input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    className="w-full pl-8 p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                                                    required
                                                    min="0"
                                                    step="0.01"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                />
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Discount (%)</label>
                                            <motion.input
                                                type="number"
                                                name="discount"
                                                value={formData.discount}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                                                min="0"
                                                max="100"
                                                step="1"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.section>

                                {/* Product Details */}
                                <motion.section 
                                    variants={sectionVariants}
                                    transition={{ delay: 0.45 }}
                                    className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50"
                                >
                                    <h3 className="text-xl font-semibold text-slate-200 mb-6 pb-2 border-b border-slate-700">Product Details</h3>
                                    <div className="space-y-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                            <motion.textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500 min-h-[120px]"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            />
                                        </motion.div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.55 }}
                                            >
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Stock Quantity</label>
                                                <motion.input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                                                    min="0"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                />
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma separated)</label>
                                                <motion.input
                                                    type="text"
                                                    name="tags"
                                                    value={formData.tags}
                                                    onChange={handleChange}
                                                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                                                    placeholder="tag1, tag2, tag3"
                                                    variants={inputVariants}
                                                    whileFocus="focus"
                                                />
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.65 }}
                                        >
                                            <label className="block text-sm font-medium text-slate-300 mb-2">Search Keywords (comma separated)</label>
                                            <motion.input
                                                type="text"
                                                name="searchKeywords"
                                                value={formData.searchKeywords}
                                                onChange={handleChange}
                                                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-indigo-500"
                                                placeholder="keyword1, keyword2, keyword3"
                                                variants={inputVariants}
                                                whileFocus="focus"
                                            />
                                        </motion.div>
                                    </div>
                                </motion.section>

                                {/* Specifications */}
                                <motion.section 
                                    variants={sectionVariants}
                                    transition={{ delay: 0.7 }}
                                    className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50"
                                >
                                    <h3 className="text-xl font-semibold text-slate-200 mb-6 pb-2 border-b border-slate-700">Specifications</h3>
                                    <div className="space-y-4">
                                        {Object.entries(formData.specs).length > 0 && (
                                            <motion.div 
                                                className="space-y-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ staggerChildren: 0.1 }}
                                            >
                                                <h4 className="text-sm font-medium text-slate-400">Current Specifications</h4>
                                                {Object.entries(formData.specs).map(([key, value]) => (
                                                    <motion.div 
                                                        key={key} 
                                                        className="flex items-center gap-3"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                    >
                                                        <motion.input
                                                            type="text"
                                                            value={key}
                                                            readOnly
                                                            className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
                                                            variants={inputVariants}
                                                            whileFocus="focus"
                                                        />
                                                        <motion.input
                                                            type="text"
                                                            name={key}
                                                            value={value}
                                                            onChange={handleSpecsChange}
                                                            className="flex-1 p-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
                                                            variants={inputVariants}
                                                            whileFocus="focus"
                                                        />
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => removeSpec(key)}
                                                            className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-slate-700 transition-colors"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                        >
                                                            <FaTrash className="text-sm" />
                                                        </motion.button>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                        <motion.div 
                                            className="pt-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <h4 className="text-sm font-medium text-slate-400 mb-3">Add New Specification</h4>
                                            <div className="flex items-end gap-3">
                                                <div className="flex-1">
                                                    <motion.input
                                                        type="text"
                                                        value={newSpecKey}
                                                        onChange={(e) => setNewSpecKey(e.target.value)}
                                                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
                                                        placeholder="Specification name"
                                                        variants={inputVariants}
                                                        whileFocus="focus"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <motion.input
                                                        type="text"
                                                        value={newSpecValue}
                                                        onChange={(e) => setNewSpecValue(e.target.value)}
                                                        className="w-full p-2 bg-slate-700 border border-slate-600 rounded text-slate-100"
                                                        placeholder="Specification value"
                                                        variants={inputVariants}
                                                        whileFocus="focus"
                                                    />
                                                </div>
                                                <motion.button
                                                    type="button"
                                                    onClick={addNewSpec}
                                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center transition-colors"
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                    disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                                                >
                                                    <FaPlus />
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.section>

                                {/* Media */}
                                <motion.section 
                                    variants={sectionVariants}
                                    transition={{ delay: 0.85 }}
                                    className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700/50"
                                >
                                    <h3 className="text-xl font-semibold text-slate-200 mb-6 pb-2 border-b border-slate-700">Media</h3>
                                    <div className="space-y-6">
                                        <motion.div
                                            className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500 transition-colors"
                                            whileHover={{ scale: 1.005 }}
                                            whileTap={{ scale: 0.995 }}
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <FiUpload className="text-slate-400 text-3xl" />
                                                <p className="text-slate-300">
                                                    Drag & drop images here, or click to select
                                                </p>
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <motion.label
                                                    htmlFor="image-upload"
                                                    className="text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer px-4 py-2 bg-slate-700 rounded-lg transition-colors"
                                                    whileHover={buttonHover}
                                                    whileTap={buttonTap}
                                                >
                                                    Browse files
                                                </motion.label>
                                            </div>
                                        </motion.div>
                                        <AnimatePresence>
                                            {images.length > 0 && (
                                                <motion.div 
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {images.map((image, index) => (
                                                        <motion.div 
                                                            key={index} 
                                                            className="relative group aspect-square"
                                                            initial={{ opacity: 0, scale: 0.9 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.9 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <div className="w-full h-full bg-slate-700 rounded-lg overflow-hidden">
                                                                {image instanceof File ? (
                                                                    <img
                                                                        src={URL.createObjectURL(image)}
                                                                        alt={`Preview ${index}`}
                                                                        className="object-cover h-full w-full"
                                                                    />
                                                                ) : (
                                                                    <div className="flex items-center justify-center h-full">
                                                                        <FiImage className="text-slate-500 text-4xl" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <motion.button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
                                                                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <FaTimes />
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.section>
                            </form>
                        </div>

                        {/* Submit Buttons */}
                        <div className="sticky bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 py-4 px-6 shadow-lg">
                            <div className="flex justify-end gap-4">
                                <motion.button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-3 border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors"
                                    disabled={isLoading}
                                    whileHover={buttonHover}
                                    whileTap={buttonTap}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 transition-colors flex items-center gap-2"
                                    disabled={isLoading}
                                    whileHover={buttonHover}
                                    whileTap={buttonTap}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : isEditing ? 'Update Product' : 'Create Product'}
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductPanelModal;