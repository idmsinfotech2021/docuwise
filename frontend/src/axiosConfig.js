// frontend/src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // Pointing to your backend
  timeout: 10000, // Optional timeout
});

export default axiosInstance;
