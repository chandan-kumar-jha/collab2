import axios from "axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api" // local backend
    : "/api"; // production (same domain)

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default axiosInstance;