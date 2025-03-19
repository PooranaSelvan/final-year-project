import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          
          {/* Alert Box */}
          <div className="alert alert-success py-4 px-3 shadow-lg">
            <h4 className="alert-heading mb-4">Payment Successful!</h4>
            <p className="mb-3">Your payment has been processed successfully. Thank you for your purchase!</p>

            <button onClick={() => navigate('/')} className="btn btn-success btn-lg mt-3">
              Back to Home
            </button>

            <button onClick={() => navigate('/order-history')} className="btn btn-primary btn-lg mt-3">
              Order History
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;