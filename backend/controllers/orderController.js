import Order from '../models/orderModel.js';  // Your Order model

export const getUserOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'products.productId',
        select: 'name price', // Selects only required fields
      });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
