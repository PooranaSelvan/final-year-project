import express from 'express';
import { getUserOrders, createOrderHistory } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getUserOrders);
router.post('/', createOrderHistory);

export default router;
