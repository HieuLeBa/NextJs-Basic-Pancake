import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { redirect } from "next/navigation";

const ENTITY_ERROR_STATUS = 422;
const AUTHENTICATION_ERROR_STATUS = 401;

// export class HttpError extends Error {
//   constructor({ status, payload }) {
//     super("Http Error");
//     this.status = status;
//     this.payload = payload;
//   }
// }

// export class EntityError extends HttpError {
//   constructor({ status, payload }) {
//     super({ status, payload });
//     this.status = status;
//     this.payload = payload;
//   }
// }

// let clientLogoutRequest = null;
// export const isClient = () => typeof window !== "undefined";
// const request = async (method, url, options) => {
//   let body = undefined;
//   if (options && options.body instanceof FormData) {
//     body = options.body;
//   } else if (options && options.body) {
//     body = JSON.stringify(options.body);
//   }
//   const baseHeaders =
//     body instanceof FormData
//       ? {}
//       : {
//           "Content-Type": "application/json",
//         };
//   if (isClient()) {
//     const sessionToken = localStorage.getItem("sessionToken");
//     if (sessionToken) {
//       baseHeaders.Authorization = `Bearer ${sessionToken}`;
//     }
//   }

//   const baseUrl =
//     options && options.baseUrl === undefined
//       ? envConfig.NEXT_PUBLIC_API_ENDPOINT
//       : options.baseUrl;

//   const fullUrl = url.startsWith("/")
//     ? `${baseUrl}${url}`
//     : `${baseUrl}/${url}`;

//   const res = await fetch(fullUrl, {
//     ...options,
//     headers: {
//       ...baseHeaders,
//       ...(options && options.headers),
//     },
//     body,
//     method,
//   });
//   const payload = await res.json();
//   const data = {
//     status: res.status,
//     payload,
//   };
//   if (!res.ok) {
//     if (res.status === ENTITY_ERROR_STATUS) {
//       throw new EntityError(data);
//     } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
//       if (isClient()) {
//         if (!clientLogoutRequest) {
//           clientLogoutRequest = fetch("/api/auth/logout", {
//             method: "POST",
//             body: JSON.stringify({ force: true }),
//             headers: {
//               ...baseHeaders,
//             },
//           });
//           try {
//             await clientLogoutRequest;
//           } catch (error) {
//           } finally {
//             localStorage.removeItem("sessionToken");
//             localStorage.removeItem("sessionTokenExpiresAt");
//             clientLogoutRequest = null;
//             location.href = "/login";
//           }
//         }
//       } else {
//         const sessionToken =
//           options && options.headers.Authorization.split("Bearer ")[1];
//         redirect(`/logout?sessionToken=${sessionToken}`);
//       }
//     } else {
//       throw new HttpError(data);
//     }
//   }
//   if (isClient()) {
//     if (
//       ["auth/login", "auth/register"].some(
//         (item) => item === normalizePath(url)
//       )
//     ) {
//       const { token, expiresAt } = payload.data;
//       localStorage.setItem("sessionToken", token);
//       localStorage.setItem("sessionTokenExpiresAt", expiresAt);
//     } else if ("auth/logout" === normalizePath(url)) {
//       localStorage.removeItem("sessionToken");
//       localStorage.removeItem("sessionTokenExpiresAt");
//     }
//   }
//   return data;
// };

// const http = {
//   get(url, options) {
//     return request("GET", url, options);
//   },
//   post(url, body, options) {
//     return request("POST", url, { ...options, body });
//   },
//   put(url, body, options) {
//     return request("PUT", url, { ...options, body });
//   },
//   delete(url, options) {
//     return request("DELETE", url, { ...options });
//   },
// };

// export default http;

export class HttpError extends Error {
  constructor({ status, payload }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  constructor({ status, payload }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}

class SessionToken {
  token = "";
  _expiresAt = new Date().toISOString();
  get value() {
    return this.token;
  }
  set value(token) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = token;
  }
  get expiresAt() {
    return this._expiresAt;
  }
  set expiresAt(expiresAt) {
    if (typeof window === "undefined") {
      throw new Error("Cannot set expiresAt on server side");
    }
    this._expiresAt = expiresAt;
  }
}

export const clientSessionToken = new SessionToken();

let clientLogoutRequest = null;

const request = async (method, url, options) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        };
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    },
    body,
    method,
  });

  const payload = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(data);
    } else if (res.status === AUTHENTICATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (clientLogoutRequest) {
          clientLogoutRequest = await fetch("/api/auth/logout", {
            method: "POST",
            body: JSON.stringify({ force: true }),
            headers: { ...baseHeaders },
          });
          await clientLogoutRequest;
          clientSessionToken.value = "";
          clientSessionToken.expiresAt = new Date().toISOString();
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        const sessionToken =
          options?.headers?.Authorization.split("Bearer ")[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = payload.data.token;
      clientSessionToken.expiresAt = payload.data.expiresAt;
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
    }
  }
  return data;
};

export const http = {
  get(url, options) {
    return request("GET", url, options);
  },
  post(url, body, options) {
    return request("POST", url, { ...options, body });
  },
  put(url, body, options) {
    return request("PUT", url, { ...options, body });
  },
  delete(url, options) {
    return request("DELETE", url, options);
  },
};
