import express from 'express';
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productController.js';
import handleUpload from '../middleware/multer.js'; // This already includes fields config
import adminAuth from '../middleware/adminAuth.js';
import { body, param } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';

const productRouter = express.Router();

console.log('\x1b[36m%s\x1b[0m', `🛒 Product routes initialized at ${new Date().toISOString()}`);

// CREATE - Admin only
productRouter.post(
  '/',
  adminAuth,
  handleUpload, // Use the pre-configured middleware directly
  [
    body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    body('category').notEmpty().withMessage('Category is required'),
    validateRequest
  ],
  addProduct
);

// READ - Public
productRouter.get('/', listProducts);

productRouter.get(
  '/:id',
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID format'),
    validateRequest
  ],
  singleProduct
);

// DELETE - Admin only
productRouter.delete(
  '/:id',
  adminAuth,
  [
    param('id')
      .isMongoId()
      .withMessage('Invalid product ID format'),
    validateRequest
  ],
  removeProduct
);

// Error handling middleware (unchanged)
productRouter.use((err, req, res, next) => {
  console.error('\x1b[31m%s\x1b[0m', `🚨 Product route error: ${err.message}`);
  
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ 
      success: false,
      error: 'File too large (max 5MB per image)' 
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      success: false,
      error: 'Maximum 4 images allowed' 
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Operation failed' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default productRouter;