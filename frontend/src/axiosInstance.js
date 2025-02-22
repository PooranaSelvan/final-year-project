import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "https://final-year-project-312a.onrender.com/api",
  withCredentials: true,
});

export default axiosInstance;