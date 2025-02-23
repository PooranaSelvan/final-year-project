import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import axiosInstance from '../axiosInstance.js';
import Loader from "../components/Loader.jsx";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Ensure loading is initially true

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // Start loading
      try {
        const { data } = await axiosInstance.get('/products/');

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Ensure no crash
      }
      setLoading(false); // Stop loading only after fetch completes
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-light">
      <div className="container py-3">
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h2 className="display-4 fw-bold">All Products</h2>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="col" key={product._id}>
                <Product products={product} />
              </div>
            ))
          ) : (
            <p className="text-center w-100">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
