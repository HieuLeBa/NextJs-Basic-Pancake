import { http } from "@/lib/http";

const accountApiRequest = {
  me: (sessionToken) =>
    http.get("account/me", {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
    }),
  meClient: () => http.get("account/me"),
  updateMe: (body) => http.put("account/me", body),
};

export default accountApiRequest;
