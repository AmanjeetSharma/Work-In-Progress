import Product from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAISummaryAndTags, generateEmbedding } from "../utils/aiRecommender.js";
import slugify from "slugify";
import fs from "fs";


const createProduct = asyncHandler(async (req, res) => {
    let { name, brand, model, category, price, discount, specs, description, tags, searchKeywords, stock } = req.body;

    const requiredFields = { name, brand, model, category, price };
    for (const [key, value] of Object.entries(requiredFields)) {
        if (value === undefined || value === null || (typeof value === "string" && !value.trim())) {
            throw new ApiError(400, `${key} is required`);
        }
    }
    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
        throw new ApiError(400, "Product with this name already exists");
    }

    const files = req?.files?.productImages || [];
    if (files.length > 3) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        console.log("❌ Deleted local files due to too many images uploaded.");
        throw new ApiError(400, "Maximum 3 product images are allowed.");
    }

    // ✅ Check for duplicate file names
    const fileNames = files.map(file => file.originalname);
    const uniqueNames = new Set(fileNames);

    if (uniqueNames.size !== fileNames.length) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        throw new ApiError(400, "Duplicate file names detected. Please use unique names for each file.");
    }

    let imageUrls = [];
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const folderPath = `Work-in-Progress/products/${slugify(name, { lower: true, strict: true })}`;

            const imagesResult = await uploadOnCloudinary(file.path, folderPath);
            if (!imagesResult) {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                throw new ApiError(400, "Failed to upload images to Cloudinary.");
            }

            if (imagesResult && imagesResult.secure_url) {
                imageUrls.push(imagesResult.secure_url);
            }
        }
    }

    if (specs && typeof specs === "object" && !Array.isArray(specs)) {
        specs = Object.assign({}, specs);
    }

    const { summary, tags: aiTags } = await generateAISummaryAndTags(description);
    const embedding = await generateEmbedding(description);

    // ✅ Create slug
    const slug = slugify(name, { lower: true, strict: true });

    const newProduct = await Product.create({
        name,
        slug,
        brand,
        model,
        category,
        price,
        discount,
        specs: specs || {},
        description,
        images: imageUrls,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        searchKeywords: searchKeywords ? searchKeywords.split(",").map(kw => kw.trim()) : [],
        stock: stock || 0,
        aiMeta: {
            aiSummary: summary,
            aiTags,
            descriptionGenerated: true,
            keywordsEmbedding: embedding
        }
    });

    return res
        .status(201)
        .json(new ApiResponse(201, newProduct, "Product created successfully").toJSON());
});












const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, brand, model, category, price, discount, specs, description, tags, searchKeywords, stock } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const files = req?.files?.productImages || [];
    if (files.length > 3) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        throw new ApiError(400, "Maximum 3 product images are allowed.");
    }
    // ✅ Check for duplicate file names
    const fileNames = files.map(file => file.originalname);
    const uniqueNames = new Set(fileNames);

    if (uniqueNames.size !== fileNames.length) {
        files.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        throw new ApiError(400, "Duplicate file names detected. Please use unique names for each file.");
    }

    let imageUrls = product.images;
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const folderPath = `Work-in-Progress/products/${slugify(name || product.name, { lower: true, strict: true })}`;

            const result = await uploadOnCloudinary(file.path, folderPath);
            if (!result) {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                throw new ApiError(400, "❌  Failed to upload images to Cloudinary.");
            }
            if (result && result.secure_url) {
                imageUrls.push(result.secure_url);
            }
        }
    }

    let aiSummary = product.aiMeta.aiSummary;
    let aiTags = product.aiMeta.aiTags;
    let descriptionGenerated = product.aiMeta.descriptionGenerated;
    let embedding = product.aiMeta.keywordsEmbedding;

    if (description && description !== product.description) {
        const aiResult = await generateAISummaryAndTags(description);
        embedding = await generateEmbedding(description);
        aiSummary = aiResult.summary;
        aiTags = aiResult.tags;
        descriptionGenerated = true;
    }

    product.name = name || product.name;
    product.slug = slugify(product.name, { lower: true, strict: true });
    product.brand = brand || product.brand;
    product.model = model || product.model;
    product.category = category || product.category;
    product.price = price !== undefined ? price : product.price;
    product.discount = discount !== undefined ? discount : product.discount;
    product.specs = specs || product.specs;
    product.description = description || product.description;
    product.images = imageUrls;
    product.tags = tags ? tags.split(",").map(tag => tag.trim()) : product.tags;
    product.searchKeywords = searchKeywords ? searchKeywords.split(",").map(kw => kw.trim()) : product.searchKeywords;
    product.stock = stock !== undefined ? stock : product.stock;
    product.aiMeta = {
        aiSummary,
        aiTags,
        descriptionGenerated,
        keywordsEmbedding: embedding,
    };

    await product.save();

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product updated successfully").toJSON());
});














// Problem without pagination :-If you don’t use page and limit, and you have 5000 products, your API would return all 5000 at once!
// ❌ Slow for backend and frontend to render, bad for performance, bad UX.

const getAllProducts = asyncHandler(async (req, res) => {
    const { search, category, tags, minPrice, maxPrice, page = 1, limit = 6 } = req.query;

    const queryObject = {};

    // Name search
    if (search) {
        queryObject.name = { $regex: search, $options: "i" }; // Case-insensitive
    }

    // Category filter
    if (category) {
        queryObject.category = category;
    }

    // Tags filter
    if (tags) {
        const tagsArray = tags.split(",").map(tag => tag.trim());
        queryObject.tags = { $in: tagsArray };
    }

    // Price range filter
    if (minPrice || maxPrice) {
        queryObject.price = {};
        if (minPrice) {
            queryObject.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
            queryObject.price.$lte = Number(maxPrice);
        }
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(queryObject)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalProducts = await Product.countDocuments(queryObject);

    return res
        .status(200)
        .json(new ApiResponse(200, {
            products,
            totalProducts,
            currentPage: Number(page),
            totalPages: Math.ceil(totalProducts / Number(limit))
        }, "Products fetched successfully").toJSON());
});









const getProductBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });

    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    console.log("Fetched product by slug:", product);
    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product fetched successfully").toJSON());
});







const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(productId);
    console.log("Deleted product:", deletedProduct);

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found or already deleted");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, deletedProduct, "Product deleted successfully").toJSON());
});



export { createProduct, updateProduct, getAllProducts, getProductBySlug, deleteProduct };