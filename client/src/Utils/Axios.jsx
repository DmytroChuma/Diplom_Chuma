import axios from "axios"
const axiosInstance = axios.create({
  baseURL: "https://house-f621.onrender.com",
  withCredentials: true,
})
export default axiosInstance