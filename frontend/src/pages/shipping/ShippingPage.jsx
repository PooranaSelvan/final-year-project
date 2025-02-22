import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../../axiosInstance.js';

const ShippingPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [loading, setLoading] = useState(true); // Loading state for fetching addresses
  const [error, setError] = useState(null); // Error state for handling fetch failures

  const navigate = useNavigate();

  // Fetch the addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/shipping', { withCredentials: true });
        // console.log('Fetched addresses:', data);

        if (Array.isArray(data)) {
          setAddresses(data);
        } else {
          console.error('API did not return an array:', data);
          setAddresses([]);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        setError('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Handle adding new address
  const handleAddAddress = async () => {
    try {
      const { data } = await axiosInstance.post('/shipping', newAddress, {
        withCredentials: true,
      });
      if (data?.addresses) {
        setAddresses(data.addresses);
        toast.success('Address added successfully');
      } else {
        toast.error('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  // Handle deleting an address
  const handleDeleteAddress = async (addressId) => {
    try {
      const { data } = await axiosInstance.delete(`/shipping/${addressId}`, {
        withCredentials: true,
      });
      if (data?.addresses) {
        setAddresses(data.addresses);
        toast.success('Address deleted successfully');
      } else {
        toast.error('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      toast.error('Failed to delete address');
    }
  };

  // Postal code validation to autofill city, state, country
  const handlePostalCodeChange = async (e) => {
    const postalCode = e.target.value;
    setNewAddress((prev) => ({
      ...prev,
      postalCode,
    }));

    // Check if postal code length is 6 and then auto-fill city, state, country
    if (postalCode.length === 6) {
      try {
        // Call Pincode API to get address info based on the postal code
        const response = await axios.get(`https://api.postalpincode.in/pincode/${postalCode}`);
        if (response.data[0].Status === 'Success') {
          const { District, State } = response.data[0].PostOffice[0];
          setNewAddress({
            ...newAddress,
            city: District,
            state: State,
            country: 'India', // Set country to India
          });
        } else {
          toast.error('Invalid postal code');
        }
      } catch (error) {
        console.error('Error fetching postal code data:', error);
        toast.error('Invalid postal code');
      }
    }
  };

  const handleBuyWithAddress = async (addressId) => {
    try {
      const selectedAddress = addresses.find((address) => address._id === addressId);
      navigate("/payment");
    } catch (error) {
      console.error("Error selecting address:", error);
      toast.error("Failed to select address.");
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="d-flex flex-wrap justify-content-between">
        <h1 className="text-center text-primary mb-4">Shipping Page</h1>
        <Link to="/cart" className="btn btn-link text-decoration-none mb-4">
          <ArrowLeft className="me-2" />
          <span>Go back</span>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading addresses...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Display existing addresses */}
      {!loading && !error && addresses.length > 0 ? (
        <div className="list-group">
          {addresses.map((addr) => (
            <div key={addr._id} className="list-group-item d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <h5>{addr.fullName}</h5>
                <p>{addr.address}, {addr.city}, {addr.state}, {addr.postalCode}, {addr.country}</p>
                <p>Phone: {addr.phone}</p>
              </div>
              <button className='btn btn-success' onClick={() => handleBuyWithAddress(addr._id)}>Buy With This Address</button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteAddress(addr._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && <p>No shipping addresses found.</p>
      )}

      {/* Form to add a new address */}
      <h3 className="mt-5">Add New Address</h3>
      <div className="card p-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={newAddress.fullName}
            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Address"
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Postal Code"
            value={newAddress.postalCode}
            onChange={handlePostalCodeChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            disabled
            value={newAddress.city}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="State"
            disabled
            value={newAddress.state}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            disabled
            value={newAddress.country}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Phone"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleAddAddress}
        >
          Add Address
        </button>
      </div>
    </div>
  );
};

export default ShippingPage;
