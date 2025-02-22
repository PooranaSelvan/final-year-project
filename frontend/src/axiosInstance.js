import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-com-backend-vev8.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;