import { http } from "@/lib/http";
const authApiRequest = {
  login: (body) => http.post("/auth/login", body),
  register: (body) => http.post("/auth/register", body),
  auth: (body) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sessionToken) =>
    http.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (force, signal) =>
    http.post(
      "/api/auth/logout",
      { force },
      {
        baseUrl: "",
        signal,
      }
    ),
  slideSessionFromNextServerToServer: (sessionToken) =>
    http.post(
      "/auth/slide-session",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  slideSessionFromNextClientToNextServer: () =>
    http.post("/api/auth/slide-session", {}, { baseUrl: "" }),
};

export default authApiRequest;
