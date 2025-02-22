import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance.js";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(axiosInstance);
    // Fetch user data
    axiosInstance
      .get("/users/auth", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.isLoggedIn);
        setIsSeller(response.data.user?.isSeller || false);
        setIsAdmin(response.data.user?.isAdmin || false);
      })
      .catch((error) => {
        console.error("Error checking auth status:", error);
        setIsLoggedIn(false);
      });

    // Get cart count
    axiosInstance
      .get("/cart", { withCredentials: true })
      .then((response) => {
        setCartCount(response.data.cartItems.length || 0);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
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
      .catch((error) => console.error("Logout failed:", error));

    toast.success("Logged Out Successfully!");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mt-2">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="/images/bootstrap.png" alt="Bootstrap Logo" width="65" height="54" />
        </Link>

        {/* Hamburger Button for Mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="list-unstyled d-flex flex-wrap align-items-center gap-2">
            {isLoggedIn ? (
              <>
                {isSeller && (
                  <li className="nav-item">
                    <Link to="/sell" className="btn btn-primary text-white rounded-pill px-4 py-2 shadow-sm me-2">
                      Sell
                    </Link>
                  </li>
                )}

                {/* Admin Panel Button */}
                {isAdmin && (
                  <li className="nav-item">
                    <Link to="/admin" className="btn btn-warning text-dark rounded-pill px-4 py-2 shadow-sm me-2">
                      Admin Panel
                    </Link>
                  </li>
                )}

                {/* Cart Icon with Badge */}
                <li className="nav-item position-relative me-3">
                  <Link to="/cart" className="btn btn-primary text-white rounded-pill px-4 py-2 shadow-sm">
                    <ShoppingCart />
                    {cartCount > 0 && (
                      <span className="badge position-absolute top-0 start-100 translate-middle bg-danger">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>

                {/* Dropdown Menu */}
                <li className="nav-item dropdown">
                  <button className="btn btn-secondary dropdown-toggle" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                    Menu
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/order-history">
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/settings">
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
                <Link to="/login" className="btn btn-primary text-white px-4 py-2 rounded-pill fw-semibold">
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
