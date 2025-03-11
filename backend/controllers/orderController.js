import Order from '../models/orderModel.js';

export const getUserOrders = async (req, res) => {
  const { userId } = req.query;

  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'products.productId',
        select: 'name price',
      });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


export const createOrderHistory = async (req, res) => {
  // console.log(req.body);

  const { orderId, amount, currency, userId, products } = req.body;

  if (!req.body.orderId) {
    return res.status(400).json({ status: 'failure', message: 'orderId is required' });
  }
  

  const order = new Order({
    amount: amount,
    orderId: orderId,
    currency: currency,
    user: userId,
    products: products.map((product) => ({
      productId: product.product,
      quantity: product.qty,
      price: product.price,
      name: product.name
    }))
  });

  try {
    await order.save();
    res.json({ status: 'success', message: 'Order history created successfully' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.json({ status: 'failure', message: 'Error saving order history' });
  }
};