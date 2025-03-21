import axios from "axios";

// console.log(import.meta.env.VITE_BACKEND_URL);
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://final-year-project-production.up.railway.app/api", // need to change while testing...
  withCredentials: true,
});

export default axiosInstance;