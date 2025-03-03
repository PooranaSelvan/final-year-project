import React from "react";
import { Link } from "react-router-dom";
// import Rating from "./Rating";
import "../index.css";

const Product = ({ products }) => {

  if (!products) return <p>Loading...</p>; 

  // console.log(products)
  return (
    <Link to={`/products/${products._id}`} className="text-decoration-none">
      <div className="card h-100 mb-4 mx-2 shadow-sm hover-shadow" id={`${products._id}`}>
        <div className="position-relative">
          <img 
            src={`${products.image}`} 
            alt={products.name} 
            className="card-img-top"
            style={{ aspectRatio: '16/9', objectFit: 'cover' }}
            fetchpriority="high"
            loading="lazy"
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h2 className="card-title h5 text-truncate mb-2">
            {products.name}
          </h2>
          <div className="mb-2">
            {/* <Rating value={products.rating} text={products.numReviews} /> */}
          </div>
          <p className="card-text text-primary fs-4 fw-semibold mb-2">
            ₹{products.price}
          </p>
          <p className="card-text small text-muted mb-2" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {products.description}
          </p>
          <div className="mt-auto text-end">
            <button className="btn btn-primary rounded-pill">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;