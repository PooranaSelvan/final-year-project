import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { ArrowLeft } from 'lucide-react';
import axiosInstance from "../axiosInstance.js";
import Loader from "../components/Loader.jsx";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userID = userInfo?._id;

  useEffect(() => {
    const fetchCartItems = async () => {
      // console.log(userID);

      if (!userID) {
        toast.error("User not logged in");
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/cart?userId=${userID}`,
          {
            withCredentials: true,
          }
        );

        setCartItems(data.cartItems);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load cart:", error);
        toast.error("Failed to load cart.");
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleQtyChange = async (id, value) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = userInfo?.token; 

    try {
      setQuantities((prevState) => ({
        ...prevState,
        [id]: value,
      }));

      await axiosInstance.put(
        `/cart?userId=${userInfo._id}`,
        { productId: id, qty: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, 
        }
      );

      toast.success("Cart updated successfully!");
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("Failed to update cart. Please try again.");
    }
  };

  const removeFromCartHandler = async (productId) => {
    try {
      await axiosInstance.delete(`/cart/`, {
        data: { productId, userId: userID },
        withCredentials: true,
      });
      setCartItems(cartItems.filter((item) => item._id !== productId)); 
      toast.success("Product removed from cart");
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  const checkOutHandler = () => {
    navigate("/shipping");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="fs-4">
          <Loader />
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="alert alert-warning text-center">
        <p>Your cart is empty. Start adding items!</p>
        <Link to="/" className="btn btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between">
      <h1 className="text-center text-primary mb-4">Your Cart</h1>
      <Link to="/" className="btn btn-link text-decoration-none mb-4">
        <ArrowLeft className="me-2" />
        <span>Go back</span>
      </Link>
      </div>

      <div className="row">
        {/* Cart Items */}
        <div className="col-md-8">
          {cartItems.map((item) => (
            <div className="card mb-3" key={item._id}>
              <div className="row g-0">
                {/* Product Image */}
                <div className="col-md-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded-start"
                    loading="lazy"
                  />
                </div>
                {/* Product Details */}
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">
                      Price: <strong>₹{item.price}</strong>
                    </p>
                    <div className="mb-3">
                      {item.countInStock > 0 && (
                        <div>
                          <label className="form-label">Quantity:</label>
                          <select
                            className="form-select"
                            value={quantities[item._id] || item.qty}
                            onChange={(e) =>
                              handleQtyChange(item._id, Number(e.target.value))
                            }
                          >
                            {[...Array(item.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeFromCartHandler(item._id)}
                      className="btn btn-danger"
                    >
                      <Trash2 size={16} className="me-2" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Summary</h5>
              <p>
                Subtotal:{" "}
                <strong>
                  {cartItems.reduce(
                    (acc, item) => acc + (quantities[item._id] || item.qty),
                    0
                  )}{" "}
                  items
                </strong>
              </p>
              <p>
                Total Price:{" "}
                <strong>
                  $
                  {cartItems
                    .reduce(
                      (acc, item) =>
                        acc + (quantities[item._id] || item.qty) * item.price,
                      0
                    )
                    .toFixed(2)}
                </strong>
              </p>
              <button
                className="btn btn-success w-100"
                onClick={checkOutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
