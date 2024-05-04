import { decodeJWT } from "@/lib/utils";

export async function POST(request) {
  const body = await request.json();
  const sessionToken = body.sessionToken;
  const expiresAt = body.expiresAt;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }

  const expiresDate = new Date(expiresAt).toUTCString();
  return Response.json(body, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
    },
  });
}
