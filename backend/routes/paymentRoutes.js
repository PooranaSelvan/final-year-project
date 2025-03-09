// routes/paymentRoutes.js
import express from 'express';
import { createCashfreeOrder, checkStatus } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', createCashfreeOrder);
router.post('/check-status', checkStatus);

export default router;
