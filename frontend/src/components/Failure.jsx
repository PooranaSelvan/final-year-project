import React from 'react';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">

          {/* Alert Box */}
          <div className="alert alert-danger py-4 px-3 shadow-lg">
            <h4 className="alert-heading mb-4">Oops, something went wrong!</h4>
            <p className="mb-3">We couldn't process your request. Please try again later.</p>

            {/* Back to Home Button */}
            <button onClick={() => navigate('/')} className="btn btn-danger btn-lg mt-3">
              Back to Home
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Failure;
