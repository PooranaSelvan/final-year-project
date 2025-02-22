import express from 'express';
import { getUserOrders } from '../controllers/orderController.js';

const router = express.Router();

// Get user orders
router.get('/', getUserOrders);

export default router;
