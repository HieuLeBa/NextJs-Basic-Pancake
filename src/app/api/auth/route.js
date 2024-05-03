export async function POST(request) {
  const res = await request.json();
  const sessionToken = res.sessionToken;
  // const expiresAt = body.expiresAt;
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 400,
      }
    );
  }
  // const expiresDate = new Date(expiresAt).toUTCString();
  return Response.json(res, {
    status: 200,
    headers: {
      "Set-Cookie": `sessionToken=${sessionToken}; Path=/; HttpOnly;`,
    },
  });
}
