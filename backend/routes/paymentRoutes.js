// routes/paymentRoutes.js
import express from 'express';
import { createOrder, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', createOrder);

// Webhook route for Razorpay to notify payment success
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;
