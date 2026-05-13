import axios from "axios";

const API = axios.create({
  // baseURL: "ht//tp://localhost:5000/api",
  baseURL: "https://chatapp-g1xv.onrender.com/api"
});


// Automatically attach token
API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;