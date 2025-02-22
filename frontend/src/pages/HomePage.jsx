import React, { useEffect, useState } from 'react';
import Product from '../components/Product';
import axiosInstance from '../axiosInstance.js';

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get('/products/');
        // console.log('API Response:', data);
  
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          console.error('Unexpected API response format:', data);
          setProducts([]); // Handle unknown response
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };
  
    fetchProducts();
  }, []);
  
  

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
                {/* {console.log(product)} */}
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
