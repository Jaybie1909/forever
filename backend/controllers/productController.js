import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';
import mongoose from 'mongoose';
import fs from 'fs';

// Configure Cloudinary (should also be in a separate config file)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const addProduct = async (req, res) => {
  try {
    // 1. Validate required fields
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
    
    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate price
    if (isNaN(price) || Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    // 2. Validate files
    if (!req.files?.image1) {
      return res.status(400).json({
        success: false,
        message: 'At least one image is required'
      });
    }

    // 3. Process files
    const files = {
      image1: req.files.image1?.[0],
      image2: req.files.image2?.[0],
      image3: req.files.image3?.[0],
      image4: req.files.image4?.[0]
    };

    const images = [files.image1, files.image2, files.image3, files.image4].filter(Boolean);

    // Upload to Cloudinary
    const uploadResults = await Promise.all(
      images.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'products',
            resource_type: 'image'
          });
          return result.secure_url;
        } catch (uploadError) {
          console.error('Cloudinary upload failed:', uploadError);
          throw new Error('Failed to upload images');
        } finally {
          // Cleanup temp files
          fs.unlinkSync(file.path);
        }
      })
    );

    // Prepare product data
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      image: uploadResults,
      date: Date.now()
    };

    // Save to DB
    const product = await productModel.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    console.error('Product creation failed:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

const singleProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID format" 
      });
    }

    const product = await productModel.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    res.json({ 
      success: true, 
      product 
    });

  } catch (error) {
    console.error('Fetch product failed:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

const listProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filterObj = {};
    if (filters.category) filterObj.category = filters.category;
    if (filters.subCategory) filterObj.subCategory = filters.subCategory;
    if (filters.bestseller) filterObj.bestseller = filters.bestseller === 'true';

    const [products, total] = await Promise.all([
      productModel.find(filterObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      productModel.countDocuments(filterObj)
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        perPage: Number(limit)
      }
    });

  } catch (error) {
    console.error('List products failed:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid product ID format" 
      });
    }

    const product = await productModel.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: "Product not found" 
      });
    }

    // Delete from Cloudinary
    await Promise.all(
      product.image.map(url => {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      })
    );

    res.json({ 
      success: true, 
      message: "Product removed successfully" 
    });

  } catch (error) {
    console.error('Remove product failed:', error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
    });
  }
};

export { addProduct, singleProduct, listProducts, removeProduct };