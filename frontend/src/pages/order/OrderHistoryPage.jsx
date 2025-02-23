import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../axiosInstance.js';
import Loader from '../../components/Loader.jsx';

const OrderHistoryPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?._id) {
        toast.error('User not logged in');
        return;
      }

      try {
        const { data } = await axiosInstance.get(
          `/orders?userId=${userInfo._id}`,
          { withCredentials: true }
        );

        // Filter out successful orders only
        const successfulOrders = data.filter(order => order.status === 'successful');
        setOrders(successfulOrders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to Load Orders:", error);
        toast.error("Failed to Load Orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?._id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <p className="fs-4">
        <Loader />
      </p>
    </div>
  );

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between">
        <h1 className="text-center text-primary mb-4">Your Orders</h1>
        <Link to="/" className="btn btn-link text-decoration-none mb-4">
          <ArrowLeft className="me-2" />
          <span>Go back</span>
        </Link>
      </div>
      <div className="list-group">
        {orders.length === 0 ? (
          <p className="text-center text-muted">No successful orders found</p>
        ) : (
          orders.map((order) => (
            <div className="list-group-item hover-shadow shadow-sm border border-black p-4 mb-3 rounded" key={order._id}>
              <h5 className="text-dark">Order ID: {order.orderId}</h5>
              <p className="text-muted">Status: <span className="badge bg-success">{order.status}</span></p>
              <p className="fw-bold">Total Amount: ₹{order.amount}</p>
              <h6 className="mt-3">Products:</h6>
              {order.products.map((product) => (
                <div className="card mb-3" key={product.productId._id}>
                  <div className="card-body">
                    <h5 className="card-title">{product.productId.name}</h5>
                    <p className="card-text">Price: ₹{(Math.ceil(product.productId.price)).toFixed(2)}</p>
                    <p className="card-text">Quantity: {product.quantity}</p>
                    <Link to={`/products/${product.productId._id}`} className="btn btn-primary">
                      Buy Again
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
