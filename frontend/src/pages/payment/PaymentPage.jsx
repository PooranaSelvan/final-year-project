import React, { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance.js';
import { load } from "@cashfreepayments/cashfree-js";

const PaymentPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [quantities, setQuantities] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState('INR');
  const [userId, setUserId] = useState(userInfo._id);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [sessionId, setSessionId] = useState(''); 
  const navigate = useNavigate();


  // Initialize Cashfree SDK
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [cashfree, setCashfree] = useState(null); // Track Cashfree SDK state

  const initializeSDK = async () => {
    try {
      // console.log(import.meta.env.VITE_NODE_ENV);
      const cashfreeSdk = await load({ mode: import.meta.env.VITE_NODE_ENV === "production" ? "production" :"sandbox" });
      // console.log("Cashfree SDK loaded:", cashfreeSdk);
      setCashfree(cashfreeSdk); // Set the loaded SDK in state
      setIsSdkLoaded(true); // Mark SDK as loaded
    } catch (error) {
      console.error("Error loading Cashfree SDK:", error);
    }
  };

  useEffect(() => {
    initializeSDK();
  }, []);

  useEffect(() => {
    // Fetch cart items and then create order after cartItems are loaded
    const fetchCartItems = async () => {
      if (!userInfo._id) {
        toast.error("User not logged in");
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/cart?userId=${userInfo._id}`,
          {
            withCredentials: true,
          }
        );
        setCartItems(data.cartItems);
        // console.log(data.cartItems);
        setLoading(false);
      } catch (error) {
        console.error("Failed to Load Cart Items:", error);
        toast.error("Failed to Load Cart Items");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length === 0 || isOrderCreated) return;
  
    const totalAmount = cartItems.reduce((acc, item) => 
      acc + (quantities[item._id] || item.qty) * item.price, 0
    ).toFixed(0);
  
    const createOrder = async () => {
      try {
        const { data: userDetails } = await axiosInstance.get('/users/profile', {
          withCredentials: true
        });
  
        const modifiedProducts = cartItems.map(item => ({
          productId: item.product,
          quantity: quantities[item._id] || item.qty,
          price: item.price,
          name: item.name,
        }));
  
        const requestBody = {
          total: Number(totalAmount),
          currency: 'INR',
          userId,
          products: modifiedProducts,
          customerDetails: {
            name: userDetails.name,
            email: userDetails.email,
            mobile: userDetails.mobile,
            address: userDetails.address,
          },
          orderAmount: totalAmount,
        };
  
        const { data } = await axiosInstance.post(
          '/payment/create-order',
          requestBody,
          { withCredentials: true }
        );
  
        // console.log(data);
        setOrderId(data.orderId); // Make sure orderId is set
        setAmount(data.amount);   // Make sure amount is set
        setCurrency(data.currency);
        setSessionId(data.paymentSessionId);
  
      } catch (error) {
        console.error("Error creating order:", error.response?.data || error.message);
        toast.error("Failed to create order");
      }
    };
  
    createOrder();
  }, [cartItems, quantities, userId, isOrderCreated]);
    

  const doPayment = async () => {
    if (!isSdkLoaded) {
      toast.error("Cashfree SDK is not initialized yet.");
      return;
    }
  
    if (!sessionId) {
      toast.error("Session ID is not available.");
      return;
    }
  
    if (!cashfree) {
      toast.error("Cashfree object is not initialized.");
      return;
    }
  
    const checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_modal",
    };
  
    try {
      const result = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        console.log("User has closed the popup or there is some payment error.");
        console.log(result.error);
        return;
      }
  
      if (result.paymentDetails) {
        console.log("Payment has been completed, Check for Payment Status");
        console.log(result.paymentDetails);
  
        // Send payment details (orderId or paymentDetails) to your backend to check payment status
        const paymentResponse = await axiosInstance.post('/payment/check-status', {
          orderId: orderId,
          // amount: amount,
          // currency: currency,
          // userId: userId,
          // products: cartItems,
        });
  
        // Handle response
        if (paymentResponse.status === 200) {
          const { data } = paymentResponse;
          if (data.status === 'success') {
            try{
              await axiosInstance.post("/orders/", {
                amount: amount,
                currency: currency,
                userId: userId,
                products: cartItems,
                orderId: orderId
              });
              toast.success("Your Order History Has Been Saved..");
            } catch(err){
              console.log(err);
            }
            navigate('/success');
          } else {
            // Handle failure or active payment status
            navigate(`/failure`);
          }
        } else {
          toast.error("Failed to check payment status.");
        }
      }
    } catch (error) {
      console.error("Error during payment processing:", error);
      toast.error("An error occurred while processing the payment.");
    }
  };  
  

  return (
    <div className="container my-5 pt-5">
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
            Total Amount: <strong>{amount} {currency}</strong>
          </p>

          {/* Show Pay Now button only if the orderId is available */}
          {orderId && (
            <button className="btn btn-success w-100" onClick={doPayment}>
              Pay Now
            </button>
          )}
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="text-muted">Your payment is securely processed through Cashfree.</p>
      </div>
    </div>
  );
};

export default PaymentPage;