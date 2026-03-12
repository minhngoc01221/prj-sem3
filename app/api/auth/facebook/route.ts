import { NextResponse } from "next/server";

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/auth/facebook/callback";

/**
 * GET /api/auth/facebook
 * Redirect to Facebook OAuth consent screen
 */
export async function GET() {
  const facebookAuthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  facebookAuthUrl.searchParams.set("client_id", FACEBOOK_APP_ID);
  facebookAuthUrl.searchParams.set("redirect_uri", FACEBOOK_REDIRECT_URI);
  facebookAuthUrl.searchParams.set("state", crypto.randomUUID());
  facebookAuthUrl.searchParams.set("scope", "public_profile,email");

  return NextResponse.redirect(facebookAuthUrl.toString());
}
