import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance.js';

const PaymentPage = () => {

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//   console.log(userInfo);
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [userId, setUserId] = useState(userInfo._id);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch cart items and then create order after cartItems are loaded
    const fetchCartItems = async () => {
      if (!userInfo._id) {
        toast.error("User not logged in");
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/cart?userId=${userInfo?._id}`,
          {
            withCredentials: true,
          }
        );
        setCartItems(data.cartItems);
        setLoading(false);
      } catch (error) {
        console.error("Failed to Load Cart Items:", error);
        toast.error("Failed to Load Cart Items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Create order only after cartItems are loaded
  useEffect(() => {
    if (cartItems.length === 0) return; // Wait for cartItems to load
    const totalAmount = cartItems.reduce((acc, item) => 
      acc + (quantities[item._id] || item.qty) * item.price, 0
    ).toFixed(0);
  
    const createOrder = async () => {
      try {
        // Modify the cartItems to match the backend schema
        const modifiedProducts = cartItems.map(item => ({
          productId: item.product, // assuming productId should be 'product' field
          quantity: quantities[item._id] || item.qty, // if quantities is available, use it, otherwise use item.qty
          price: item.price, // Include price if needed
          name: item.name,   // Include name if needed
        }));
  
        const requestBody = {
          total: Number(totalAmount),
          currency: 'INR',
          userId,
          products: modifiedProducts, // Send the modified products array
        };
  
        // console.log("Sending Order Request:", requestBody); // Debugging
  
        const { data } = await axiosInstance.post(
          '/payment/create-order',
          requestBody,
          { withCredentials: true }
        );
  
        // console.log(data);
  
        setOrderId(data.orderId);
        setAmount(data.amount);
        setCurrency(data.currency);
      } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
      }
    };
  
    createOrder();
  }, [cartItems, userId]);

  const handlePayment = () => {
    if (!orderId) return;

    const options = {
      key: 'rzp_test_rF6DxHOyJXOEpp',
      amount: amount,
      currency: currency,
      name: 'Shop Loot',
      description: 'Test Transaction',
      image: 'https://example.com/your-logo.png',
      order_id: orderId,
      handler: function (response) {
        alert('Payment Successful! Payment ID: ' + response.razorpay_payment_id);
        toast.success("Payment Successful !");
        navigate("/order-history");
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
      },
      notes: {
        address: 'Address for shipping',
      },
      theme: {
        color: '#F37254',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between">
          <h1 className="text-center text-primary mb-4">Complete Your Payment</h1>
          <Link to="/shipping" className="btn btn-link text-decoration-none mb-4">
            <ArrowLeft className="me-2" />
            <span>Go back</span>
          </Link>
      </div>

      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h5 className="card-title">Order Summary</h5>
          <p className="card-text">
            Total Amount: <strong>{amount / 100} {currency}</strong>
          </p>
          <button className="btn btn-success w-100" onClick={handlePayment}>
            Pay Now
          </button>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted">Your payment is securely processed through Razorpay.</p>
      </div>
    </div>
  );
};

export default PaymentPage;
