import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Pencil, Trash, Box, Users } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import axiosInstance from "../../axiosInstance.js";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("users");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({ name: "", email: "" });
  const [updatedProductData, setUpdatedProductData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    countInStock: "",
  });

  const userApiUrl = `/users`;
  const productApiUrl = "/products";

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(userApiUrl, { withCredentials: true });
      setUsers(response.data);
    } catch (err) {
      toast.error("Failed to fetch users.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get(productApiUrl, { withCredentials: true });
      setProducts(response.data);
    } catch (err) {
      toast.error("Failed to fetch products.");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`${userApiUrl}/${userId}`, { withCredentials: true });
      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`${productApiUrl}/${productId}`, { withCredentials: true });
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const updateUser = async () => {
    try {
      await axiosInstance.put(`${userApiUrl}/${selectedUser._id}`, updatedUserData, {withCredentials: true});
      toast.success("User updated successfully");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const updateProduct = async () => {
    try {
      await axiosInstance.put(`${productApiUrl}/${selectedProduct._id}`, updatedProductData, {withCredentials: true});
      toast.success("Product updated successfully");
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };  


  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({ name: user.name, email: user.email });
  };

  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setUpdatedProductData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      countInStock: product.countInStock,
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-baseline">
        <Link to="/" className="btn btn-link text-decoration-none mb-4">
          <ArrowLeft className="me-2" />
          <span>Go back</span>
        </Link>
      </div>
      <h2 className="text-center">Admin Panel</h2>

      {/* Toggle Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button className={`btn ${activeTab === "users" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("users")}>
          <Users size={18} /> Manage Users
        </button>
        <button className={`btn ${activeTab === "products" ? "btn-primary" : "btn-secondary"}`} onClick={() => setActiveTab("products")}>
          <Box size={18} /> Manage Products
        </button>
      </div>

      {/* USERS SECTION */}
      {activeTab === "users" && (
        <div className="mt-4">
          <h4 className="text-center mb-3">Users List</h4>
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleUserEdit(user)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user._id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PRODUCTS SECTION */}
      {activeTab === "products" && (
        <div className="mt-4">
          <h4 className="text-center mb-3">Products List</h4>
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <div className="card shadow-lg p-3 mb-4">
                  <img src={product.image} className="card-img-top" alt={product.name} loading="lazy" />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="text-muted">{product.brand}</p>
                    <p>{product.description}</p>
                    <p className="fw-bold text-success">${product.price}</p>
                    <p>Stock: {product.countInStock}</p>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleProductEdit(product)}>
                      <Pencil size={16} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteProduct(product._id)}>
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USER UPDATE MODAL */}
      {selectedUser && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h4 className="text-center">Update User</h4>
              <input type="text" className="form-control my-2" placeholder="Name" 
                value={updatedUserData.name} 
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, name: e.target.value })} 
              />
              <input type="email" className="form-control my-2" placeholder="Email" 
                value={updatedUserData.email} 
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, email: e.target.value })} 
              />
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={updateUser}>Update</button>
                <button className="btn btn-secondary" onClick={() => setSelectedUser(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* PRODUCT UPDATE MODAL */}
      {selectedProduct && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h4 className="text-center">Update Product</h4>
              <input type="text" className="form-control my-2" placeholder="Name" 
                value={updatedProductData.name} 
                onChange={(e) => setUpdatedProductData({ ...updatedProductData, name: e.target.value })} 
              />
              <textarea className="form-control my-2" placeholder="Description" 
                value={updatedProductData.description} 
                onChange={(e) => setUpdatedProductData({ ...updatedProductData, description: e.target.value })} 
              />
              <input type="text" className="form-control my-2" placeholder="Brand" 
                value={updatedProductData.brand} 
                onChange={(e) => setUpdatedProductData({ ...updatedProductData, brand: e.target.value })} 
              />
              <input type="number" className="form-control my-2" placeholder="Price" 
                value={updatedProductData.price} 
                onChange={(e) => setUpdatedProductData({ ...updatedProductData, price: e.target.value })} 
              />
              <div className="d-flex justify-content-between">
                <button className="btn btn-success" onClick={updateProduct}>Update</button>
                <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
