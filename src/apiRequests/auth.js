import http from "@/lib/http";

const authApiRequest = {
  login: (body) => http.post("/auth/login", body),
  register: (body) => http.post("/auth/register", body),
  auth: (body) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  // logoutFromNextServerToServer: (sessionToken: string) =>
  //   http.post<MessageResType>(
  //     "/auth/logout",
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     }
  //   ),
  // logoutFromNextClientToNextServer: (
  //   force?: boolean | undefined,
  //   signal?: AbortSignal | undefined
  // ) =>
  //   http.post<MessageResType>(
  //     "/api/auth/logout",
  //     {
  //       force,
  //     },
  //     {
  //       baseUrl: "",
  //       signal,
  //     }
  //   ),
  // slideSessionFromNextServerToServer: (sessionToken: string) =>
  //   http.post<SlideSessionResType>(
  //     "/auth/slide-session",
  //     {},
  //     {
  //       headers: {
  //         Authorization: `Bearer ${sessionToken}`,
  //       },
  //     }
  //   ),
  // slideSessionFromNextClientToNextServer: () =>
  //   http.post<SlideSessionResType>(
  //     "/api/auth/slide-session",
  //     {},
  //     { baseUrl: "" }
  //   ),
};

export default authApiRequest;
