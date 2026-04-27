import axios from "axios";

const API = axios.create({
  baseURL: "https://your-backend-url.onrender.com", // change this
});

export default API;