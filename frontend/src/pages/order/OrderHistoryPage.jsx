import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Search, Filter } from 'lucide-react';
import axiosInstance from '../../axiosInstance.js';
import Loader from '../../components/Loader.jsx';


const OrderHistoryPage = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo?._id) {
        toast.error('User not logged in');
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/orders?userId=${userInfo._id}`, {
          withCredentials: true,
        });

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

  const formatDateTime = (dateString) => {
    const options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    };
    return new Date(dateString).toLocaleString('en-IN', options);
  };

  const handleSearch = (product) =>
    product.productId.name.toLowerCase().includes(searchQuery.toLowerCase());

  const handlePriceFilter = (product) =>
    priceFilter === '' || product.productId.price <= parseFloat(priceFilter);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h1 className="text-primary">Your Orders</h1>
        <Link to="/" className="btn btn-outline-primary d-flex align-items-center">
          <ArrowLeft className="me-2" />
          Go back
        </Link>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <span className="input-group-text"><Search size={18} /></span>
            <input
              type="text"
              className="form-control"
              placeholder="Search product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="input-group">
            <span className="input-group-text"><Filter size={18} /></span>
            <input
              type="number"
              className="form-control"
              placeholder="Max price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="list-group">
        {orders.length === 0 ? (
          <p className="text-center text-muted">No successful orders found</p>
        ) : (
          orders.map((order) => {
            const filteredProducts = order.products.filter(product =>
              handleSearch(product) && handlePriceFilter(product)
            );

            if (filteredProducts.length === 0) return null;

            return (
              <div
                className="list-group-item position-relative border border-dark p-4 mb-4 rounded shadow"
                key={order._id}
              >
                <span className="position-absolute top-0 end-0 badge bg-info text-dark mt-2 me-2 d-flex align-items-center">
                  <CalendarDays size={16} className="me-1" />
                  {formatDateTime(order.date)}
                </span>

                <h5 className="text-dark mb-2">
                  🧾 Order ID: <span className="text-secondary">{order.orderId}</span>
                </h5>
                <p className="mb-1">
                  Status: <span className="badge bg-success">{order.status}</span>
                </p>
                <p className="fw-bold text-success fs-5">Total: ₹{order.amount}</p>

                <h6 className="mt-4">🛒 Products:</h6>
                {filteredProducts.map((product) => (
                  <div className="card my-3 border border-secondary" key={product.productId._id}>
                    <div className="row g-0">
                      <div className="col-12 col-md-3 d-flex align-items-center justify-content-center p-3">
                        <img
                          src={product.productImage}
                          alt={product.productId.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '150px', objectFit: 'contain' }}
                        />
                      </div>
                      <div className="col-12 col-md-9">
                        <div className="card-body">
                          <h5 className="card-title">{product.productId.name}</h5>
                          <p className="card-text">Price: ₹{(Math.ceil(product.productId.price)).toFixed(2)}</p>
                          <p className="card-text">Quantity: {product.quantity}</p>
                          <Link to={`/products/${product.productId._id}`} className="btn btn-sm btn-outline-primary">
                            Buy Again
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;