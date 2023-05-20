import express from 'express';
import { saveOrder } from '../controllers/orderController.js';
import { getOrders } from '../controllers/orderController.js';
import { getOrderById } from '../controllers/orderController.js';
import { getOrderByUser } from '../controllers/orderController.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, saveOrder).get(protect, isAdmin, getOrders);
router.get('/user', protect, getOrderByUser);
router.get('/:id', protect, getOrderById);

export default router;
