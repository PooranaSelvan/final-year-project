import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import axiosInstance from "../axiosInstance.js";

const SellingPage = () => {
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!user?.isSeller) {
    navigate("/");
    return null;
  }

  // Handle Image Upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e-com images"); // Replace with your Cloudinary upload preset

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dssvk1cxy/image/upload`,
        formData
      );
      setImage(res.data.secure_url);
      setUploading(false);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed", error);
      setUploading(false);
      toast.error("Image upload failed");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload an image first.");
      return;
    }

    try {
      await axiosInstance.post(
        "/products",
        {
          name,
          description,
          brand,
          category,
          price,
          countInStock,
          image, // Send image URL from Cloudinary
          isSeller: user.isSeller,
          userId: user._id
        },
        { withCredentials: true }
      );

      toast.success("Product added successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-baseline">
        <Link to="/" className="btn btn-link text-decoration-none mb-4">
          <ArrowLeft className="me-2" />
          <span>Go back</span>
        </Link>
      </div>
      <h2 className="text-center">Upload New Product</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded">
        <div className="mb-3">
          <label className="form-label">Product Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Brand</label>
          <input type="text" className="form-control" value={brand} onChange={(e) => setBrand(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Price</label>
          <input type="number" className="form-control" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Count In Stock</label>
          <input type="number" className="form-control" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Product Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} required />
          {uploading && <p>Uploading...</p>}
          {image && <img src={image} alt="Product Preview" width="100" />}
        </div>
        <button type="submit" className="btn btn-primary w-100">Upload Product</button>
      </form>
    </div>
  );
};

export default SellingPage;
