import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    const status = error.response?.data?.status || 500;
    return Promise.reject({ message, status });
  }
);

export default api;
