import asyncHandler from "../middleware/asyncHandler.js";
import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js"; 


// Controller to add a product to the cart
const addToCart = asyncHandler(async (req, res) => {

  const { productId, qty } = req.body; 
  const userId = req.user._id; 
  
  const product = await Product.findById(productId); 

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ user: userId });

  if (cart) {

    // If a cart exists for the user:
    const existingItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (existingItemIndex !== -1) {
      cart.cartItems[existingItemIndex].qty = qty;
    } else {
    
      cart.cartItems.push({
        name: product.name,
        qty,
        price: product.price,
        totalPrice: product.totalPrice,
        image: product.image,
        product: productId,
        countInStock: product.countInStock,
      });
    }


  } else {


    cart = new Cart({
      user: userId,
      cartItems: [
        {
          name: product.name,
          qty,
          price: product.price,
          totalPrice: product.totalPrice,
          image: product.image,
          product: productId,
          countInStock: product.countInStock,
        },
      ],
    });
  }


  cart.itemPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;

  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);

  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  await cart.save();
  res.status(201).json(cart);
});


const updateCart = asyncHandler(async (req, res) => {

  const { productId, qty } = req.body;
  const userId = req.user._id;

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.cartItems.findIndex((item) => {
    return item._id.toString() === productId.toString();
  });

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  cart.cartItems[itemIndex].qty = qty;

  
  cart.itemPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;

  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);

  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  await cart.save(); 
  res.status(200).json(cart);
});



const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return res.status(200).json({ cartItems: [] });
  }

  res.status(200).json(cart);
});


const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id; 

  let cart = await Cart.findOne({ user: userId }); 

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === productId.toString() 
  );

  if (itemIndex === -1) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  cart.cartItems.splice(itemIndex, 1)

  cart.itemPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  cart.shippingPrice = cart.itemPrice > 100 ? 0 : 20;

  cart.taxPrice = +(0.18 * cart.itemPrice).toFixed(2);

  cart.totalPrice = cart.itemPrice + cart.shippingPrice + cart.taxPrice;

  await cart.save(); 
  res.status(200).json(cart);
});


export { addToCart, getCart, removeFromCart, updateCart };