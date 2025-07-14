import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters"],
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    brand: {
      type: String,
      trim: true,
      required: [true, "Brand is required"],
    },
    model: {
      type: String,
      trim: true,
      required: [true, "Model is required"],
    },
    category: {
      type: String,
      trim: true,
      required: [true, "Category is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount must be at least 0%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    finalPrice: {
      type: Number,
      min: [0, "Final price cannot be negative"],
    },
    specs: {
      type: Map,
      of: String,
      default: {},
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },
    aiMeta: {
      keywordsEmbedding: { type: [Number], default: [] },
      descriptionGenerated: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
