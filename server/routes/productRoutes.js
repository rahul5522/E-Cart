import express from 'express';

import {
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  addProduct,
  addProductReview,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllProducts).post(protect, isAdmin, addProduct);
router.route('/:id/reviews').post(protect, addProductReview);

router
  .route('/:id')
  .get(getProductById)
  .delete(protect, isAdmin, deleteProduct)
  .put(protect, isAdmin, updateProduct);

export default router;
