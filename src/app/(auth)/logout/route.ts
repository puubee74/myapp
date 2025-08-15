import { NextResponse } from "next/server";
const TOKEN_NAME = "token";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/login", req.url), 303); // force GET /login
  res.cookies.set(TOKEN_NAME, "", { httpOnly: true, path: "/", maxAge: 0 }); // clear cookie
  return res;
}
