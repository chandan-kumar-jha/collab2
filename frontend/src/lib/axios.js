import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://collab2-1.onrender.com/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  console.log("✅ AXIOS INSTANCE HIT:", config.baseURL + config.url);
  return config;
});

export default axiosInstance;