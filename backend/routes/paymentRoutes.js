import express from 'express';
import { createCashfreeOrder, checkStatus } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createCashfreeOrder);
router.post('/check-status', checkStatus);

export default router;
