import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance.js";
import "./navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Reference for the dropdown menu
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/users/auth", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.isLoggedIn);
        setIsSeller(response.data.user?.isSeller || false);
        setIsAdmin(response.data.user?.isAdmin || false);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogout = () => {
    axiosInstance
      .post("/users/logout", {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem("userInfo");
        navigate("/");
      })
      .catch(() => {});

    toast.success("Logged Out Successfully!");
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the event listener
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/images/shoploot.png" alt="Logo" width="65" height="54" loading="lazy" />
        </Link>

        {/* Toggle Button for Mobile */}
        <button className="navbar-toggler" onClick={() => setNavbarOpen(!navbarOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Items */}
        <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto d-flex align-items-center gap-3">
            {isLoggedIn ? (
              <>
                {isSeller && (
                  <li className="nav-item">
                    <Link to="/sell" className="btn btn-outline-primary rounded-pill px-3 py-1">
                      Sell
                    </Link>
                  </li>
                )}

                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className="btn btn-outline-warning rounded-pill px-3 py-1">
                      Admin
                    </Link>
                  </li>
                )}

                {/* Cart Icon */}
                <li className="nav-item position-relative">
                  <Link to="/cart" className="btn btn-outline-primary rounded-circle p-2">
                    <ShoppingCart size={20} />
                  </Link>
                </li>

                {/* User Dropdown */}
                <li className="nav-item dropdown" ref={dropdownRef}>
                  <button className="btn btn-outline-secondary dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                    Menu
                  </button>
                  <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                    <li>
                      <Link className="dropdown-item" to="/about" onClick={() => setDropdownOpen(false)}>
                        About
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/order-history" onClick={() => setDropdownOpen(false)}>
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings" onClick={() => setDropdownOpen(false)}>
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="btn btn-primary rounded-pill px-3 py-1">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;