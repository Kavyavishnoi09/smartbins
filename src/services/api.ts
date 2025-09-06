import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // apna backend ka URL
  withCredentials: true,
});

export default api;
