"use client"

import { useEffect, useState } from "react";
import Product from "../components/Product";
import axiosInstance from "../axiosInstance.js";
import Loader from "../components/Loader.jsx";
import "../index.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    axiosInstance
      .get("/users/auth", { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.isLoggedIn);
        // console.log(isLoggedIn);
      })
      .catch(() => setIsLoggedIn(false));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axiosInstance.get("/products/");

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error("Unexpected API response format:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [])

  // Extract unique categories from products
  const categories = ["All", ...new Set(products.map((product) => product.category || "Uncategorized"))]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || product.category === activeCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader />
      </div>
    )
  }

  return (
    <div className="bg-light mt-5 pt-4">
      {/* Hero Section with Gradient Background */}
      <div className="hero-gradient text-white py-5 mb-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-7">
              <h1 className="display-4 fw-bold">Discover Amazing Products</h1>
              <p className="lead">Find the perfect items for your needs with our extensive collection.</p>
              <div className="input-group mt-4">
                <input
                  type="text"
                  className="form-control form-control-lg border-0"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-dark" type="button">
                  <i className="bi bi-search"></i> Search
                </button>
              </div>
            </div>
            <div className="col-md-5 d-none d-md-flex justify-content-center">
              <div className="banner-image-container">
                <img
                  src="/images/shoploot.png"
                  alt="Shop Banner"
                  className="img-fluid rounded shadow hover-scale banner-image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {/* Categories */}
        <div className="mb-4 category-tabs">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`btn ${activeCategory === category ? "btn-primary" : "btn-outline-primary"}`}  // Primary color for active
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products Section (showing first 4 products) */}
        {filteredProducts.length > 0 && activeCategory === "All" && !searchTerm && (
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold">Featured Products</h2>
              <a href="#all-products" className="btn btn-outline-primary">
                View All
              </a>
            </div>
            <div className="row g-4">
              {products.slice(0, 4).map((product) => (
                <div className="col-lg-3 col-md-6 col-sm-6" key={`featured-${product._id}`}>
                  <div className="card h-100 border-0 shadow-sm product-card">
                    <Product products={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Products */}
        <div id="all-products">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h2 className="fw-bold mb-0">{activeCategory === "All" ? "All Products" : activeCategory}</h2>
            <div className="d-flex align-items-center">
              <span className="me-2">Sort by:</span>
              <select className="form-select form-select-sm" style={{ width: "150px" }}>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredProducts.map((product) => (
                <div className="col" key={product._id}>
                  <div className="card h-100 border-0 shadow-sm product-card">
                    <Product products={product} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted"></i>
              <h3 className="mt-3">No products found</h3>
              <p className="text-muted">Try adjusting your search or filter criteria</p>
              <button
                className="btn btn-primary mt-2"
                onClick={() => {
                  setSearchTerm("")
                  setActiveCategory("All")
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Newsletter Subscription with Gradient */}
        {!isLoggedIn && (
          <div className="row mt-5 pt-5 pb-4">
            <div className="col-md-8 mx-auto text-center">
              <div className="newsletter-container p-4 rounded">
                <h2 className="text-white">Sign Up for Exclusive Deals!</h2>
                <div className="input-group mt-4 d-flex flex-wrap align-items-center justify-content-center gap-5">
                  <Link to='/login'>
                    <button className="btn btn-dark" type="button">
                      Login
                    </button>
                  </Link>
                  <Link to='/register'>
                    <button className="btn btn-dark" type="button">
                      SignUp
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage