import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance.js';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await axiosInstance.post('/users', {
        name,
        email,
        password,
      });
      
      if (response.status === 201) {
        await navigate("/login");
        toast.success("Registered Successfully!");
      }
    } catch (err) {
      console.log(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
      <div className="bg-white p-5 rounded-4 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="fw-bold text-center text-primary mb-4">Register</h2>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label fw-semibold">Name</label>
          <input type="text" id="name" className="form-control shadow-sm" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">Email</label>
          <input type="email" id="email" className="form-control shadow-sm" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">Password</label>
          <input type="password" id="password" className="form-control shadow-sm" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {/* Error message */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Sign Up Button */}
        <button className="btn btn-primary w-100 fw-semibold py-2" onClick={handleSubmit}>Register</button>

        {/* Link to Login Page */}
        <div className="text-center mt-3">
          <Link to="/login" className="text-decoration-none text-primary fw-semibold">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
