import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import axiosInstance from "../axiosInstance.js";

const SettingsPage = () => {
  const [user, setUser] = useState({ name: "", email: "" });
  const [updatedUser, setUpdatedUser] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/users/profile", {
          withCredentials: true,
        });
        setUser({ name: data.name, email: data.email });
        setUpdatedUser({ name: data.name, email: data.email, password: "" });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axiosInstance.put("/users/profile", updatedUser,{ withCredentials: true });

      setMessage("Profile updated successfully!");
      setUser({ name: data.name, email: data.email });
      toast.success("Updated Successfully!");
    } catch (error) {
      setMessage("Error updating profile.");
      console.error(error);
    }

    setLoading(false);
    document.getElementById("closeModal").click(); // Close modal after updating
  };

  return (
    <div className="container mt-5">
      <div className="d-flex align-items-baseline">
        <Link to="/" className="btn btn-link text-decoration-none mb-4">
          <ArrowLeft className="me-2" />
          <span>Go back</span>
        </Link>
      </div>
      <h2 className="text-center mb-4">Settings</h2>

      <div className="card shadow-sm mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body text-center">
          <h5 className="card-title">User Profile</h5>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editProfileModal">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Update Profile Modal */}
      <div className="modal fade" id="editProfileModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {message && <p className="alert alert-success">{message}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name:</label>
                  <input type="text" name="name" className="form-control" value={updatedUser.name} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input type="email" name="email" className="form-control" value={updatedUser.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password (optional):</label>
                  <input type="password" name="password" className="form-control" value={updatedUser.password} onChange={handleChange} />
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" id="closeModal" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SettingsPage;
