import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/orderModel.js';  // Assuming you have an Order model to save data
import cron from 'node-cron';
import { razorpay } from '../server.js';

// Controller to create an order
export const createOrder = async (req, res) => {
  console.log(req.body);
  const { currency, total, userId, products } = req.body;  // Including products in the request body
  // console.log(products);

  const options = {
    amount: total * 100, // Amount in paise
    currency,
    receipt: 'receipt#1', // Optional
    payment_capture: 1, // 1 for auto-capture, 0 for manual
  };

  try {
    // Create order with Razorpay API
    const response = await razorpay.orders.create(options);

    // Save the order to your database
    const order = new Order({
      orderId: response.id,
      amount: total,
      currency,
      user: userId,
      products: products.map(product => ({
        productId: product.productId,
        quantity: product.quantity,
        price: parseFloat(product.price) * 100,  // Convert price to paise if it's a string or invalid number
        name: product.name
      }))
    });

    await order.save();

    res.json({
      orderId: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Webhook to verify payment success
export const handleWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = '123456';

  const reqBodyString = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(reqBodyString)
    .digest('hex');

  if (signature === expectedSignature) {
    const event = req.body;

    if (event.event === 'payment.captured') {
      const paymentId = event.payload.payment.entity.id;
      const orderId = event.payload.payment.entity.order_id;

      try {
        // Find the order with the orderId and include the products
        const order = await Order.findOne({ orderId }).populate('products.productId');

        if (order) {
          order.status = 'successful';
          await order.save();

          console.log(`Order ${orderId} status updated to successful.`);

          // You can now access the product details as part of the order
          console.log('Order products:', order.products);

          res.status(200).send('OK');
        } else {
          res.status(404).send('Order not found');
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).send('Error processing payment');
      }
    } else {
      res.status(200).send('Payment not captured');
    }
  } else {
    res.status(400).send('Invalid signature');
  }
};



// Set up cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // Delete orders that are pending for more than 24 hours
    const result = await Order.deleteMany({
      status: 'pending',
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Orders older than 24 hours
    });

    console.log(`${result.deletedCount} pending orders deleted.`);
  } catch (error) {
    console.error("Error during pending order cleanup:", error);
  }
});