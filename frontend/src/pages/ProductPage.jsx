import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../axiosInstance.js';


const ProductPage = () => {

  const { id } = useParams();
  const [products, setProducts] = useState([]);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);


  const addToCartHandler = async (e) => {
    e.preventDefault();
    // console.log(id);
    // console.log(localStorage.getItem("userInfo"))
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const userID = userInfo._id
    console.log(qty);


    try {
      const { data } = await axiosInstance.post("/cart/", { productId: id, userId: userID, qty }, { withCredentials: true });
      // console.log(data);
      toast.success("Successfully Added to Cart!")
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <div className="container py-5 mt-5">
      <Link to="/" className="btn btn-link text-decoration-none mb-4">
        <ArrowLeft className="me-2" />
        <span>Go back</span>
      </Link>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="bg-light p-4 rounded">
            <img className="img-fluid rounded" src={products.image || "/placeholder.svg"} alt={products.name}/>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title h3 mb-4">{products.name}</h2>
              <p className="card-text mb-4">{products.description}</p>

              <div className="mb-4">
                {/* <Rating value={products.rating} text={`${products.numReviews} reviews`} /> */}
              </div>

              <div className="row mb-4">
                <div className="col-6">
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Price</small>
                    <div className="h4 mb-0 text-primary">${products.price}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-light p-3 rounded">
                    <small className="text-muted">Stock Status</small>
                    <div className={`h4 mb-0 ${products.countInStock > 0 ? 'text-success' : 'text-danger'}`}>
                      {products.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </div>
                </div>
              </div>

              {products.countInStock > 0 && (
                <>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="quantity">
                      Quantity:
                    </label>
                    <select 
                      id="quantity" 
                      className="form-select" 
                      onChange={(e) => setQty(Number(e.target.value))} 
                      value={qty}
                    >
                      {[...Array(products.countInStock).keys()].map((stock) => (
                        <option key={stock + 1} value={stock + 1}>
                          {stock + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={addToCartHandler} 
                    className="btn btn-primary w-100"
                  >
                    Add to cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage