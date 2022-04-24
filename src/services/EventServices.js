import axios from "axios";
import applyCaseMiddleware from "axios-case-converter";

// axios case converter 
const apiClient = applyCaseMiddleware(
  axios.create({
    baseURL: "http://94.158.54.194:9092",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
);

export default {
  getProducts() {
    return apiClient.get("/api/product");
  },
  putProduct(data) {
    return apiClient.put("/api/product", data);
  },
  addProduct(data) {
    return apiClient.post("/api/product", data);
  },
  deleteProduct(id) {
    return apiClient.delete(`/api/product/${id}`);
  },
  getProductType() {
    return apiClient.get("/api/product/get-product-types");
  },
};
