import { http } from "@/lib/http";

const productApiRequest = {
  getList: () => http.get("/products"),
  getDetail: (id) =>
    http.get(`/products/${id}`, {
      cache: "no-store",
    }),
  create: (body) => http.post("/products", body),
  update: (id, body) => http.put(`/products/${id}`, body),
  uploadImage: (body) => http.post("/media/upload", body),
  delete: (id) => http.delete(`/products/${id}`),
};
export default productApiRequest;
