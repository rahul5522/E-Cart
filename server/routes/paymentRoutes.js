import express from 'express';
import { intializePayment, verify } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/orders', intializePayment);
router.post('/verify/:id', verify);

export default router;
