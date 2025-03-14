import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance";
import { Eye, EyeOff } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !mobile) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await axiosInstance.post("/users", {
        name,
        email,
        password,
        mobile,
      });
      if (response.status === 201) {
        toast.success("Registered Successfully!");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 mt-5" style={{ background: "linear-gradient(135deg, #6a11cb, #2575fc)" }}>
      <div className="bg-white p-5 rounded-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="fw-bold text-center text-primary mb-4">Register</h2>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label fw-semibold">Name</label>
            <input
              type="text"
              id="name"
              className="form-control shadow-sm border-0 rounded-pill"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
              className="form-control shadow-sm border-0 rounded-pill pe-5"
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
          <div className="mb-4">
            <label htmlFor="mobile" className="form-label fw-semibold">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              className="form-control shadow-sm border-0 rounded-pill"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 fw-semibold py-2 rounded-pill">Register</button>
        </form>
        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none text-primary fw-semibold">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;