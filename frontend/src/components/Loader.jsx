import React from 'react';
import "../loader.css";

const Loader = () => {
  return (
     <div className="flex justify-center items-center h-screen">
          <div id="container">
            <label className="loading-title">Loading ...</label>
            <span className="loading-circle sp1">
              <span className="loading-circle sp2">
                <span className="loading-circle sp3"></span>
              </span>
            </span>
          </div>
     </div>
  )
}

export default Loader