import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import axiosInstance from "../axiosInstance";
import { Eye, EyeOff } from 'lucide-react'; // Import eye icons from lucide-react

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/users/login", { email, password }, { withCredentials: true });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login Successful!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <div className="bg-white p-5 rounded-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="fw-bold text-center text-primary mb-4">Login</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="form-label fw-semibold">Email</label>
            <input
              type="email"
              id="email"
              className="form-control shadow-sm border-0 rounded-pill"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-control shadow-sm border-0 rounded-pill pe-5" // Add padding-right for space
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="position-absolute top-50 end-0 translate-middle-y me-3"
              style={{ cursor: "pointer", zIndex: 10 }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} color="#6a11cb" /> : <Eye size={20} color="#6a11cb" />}
            </span>
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 rounded-pill">Login</button>
        </form>
        <div className="text-center mt-3">
          <Link to="/register" className="text-decoration-none text-primary fw-semibold">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;