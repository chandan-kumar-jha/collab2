import axios from "axios"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://collab2-1.onrender.com/api",
  withCredentials: true,
});

// 🔥 prevent empty baseURL calls
axiosInstance.interceptors.request.use((config) => {
  if (!config.baseURL) {
    console.error("❌ Missing baseURL!");
  }
  return config;
});
export default axiosInstance