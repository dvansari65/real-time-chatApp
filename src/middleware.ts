import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "./lib/auth";

const PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/api/auth/login",
  "/api/auth/signup",
];

export const middleware = async (req: NextRequest) => {
  const pathname = req.nextUrl.pathname;
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }
  try {
    const session = await verifySession();

    if (!session || !session.expiresAt) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const userId = session?.userId;
    const response = NextResponse.next();
    response.headers.set("userId", userId);
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
};
export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"], // Protect everything except static files
};
