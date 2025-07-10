import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from '../src/config/db.js';
import Product from '../src/models/product.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedData = async () => {
  try {
    await connectDB();

    const filePath = path.join(__dirname, 'products_data.json');
    const data = await readFile(filePath, 'utf-8');
    const products = JSON.parse(data);

    await Product.deleteMany({});
    const result = await Product.insertMany(products);

    console.log(`✅ Seeded ${result.length} products successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedData();
