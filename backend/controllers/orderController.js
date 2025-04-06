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
  // console.log(products);
  // console.log("Producy Image" ,products.image);

  if (!req.body.orderId) {
    return res.status(400).json({ status: 'failure', message: 'orderId is required' });
  }


  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const formatted = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
  // console.log(formatted);

  

  const order = new Order({
    amount: amount,
    orderId: orderId,
    currency: currency,
    user: userId,
    date: formatted,
    products: products.map((product) => ({
      productId: product.product,
      quantity: product.qty,
      price: product.price,
      name: product.name,
      productImage: product.image
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