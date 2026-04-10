import axios from "axios"

const axiosInstance = axios.create({
    baseURL:"https://collab2-1.onrender.com/api",
    withCredentials:true
})

export default axiosInstance