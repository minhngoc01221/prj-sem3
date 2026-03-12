import { NextRequest, NextResponse } from "next/server";
import client, { getDb } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "karnel-travels-refresh-secret-key";

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback";

// Facebook OAuth Configuration
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/auth/facebook/callback";

// ============ Helper Functions ============

/**
 * Verify Google OAuth token and get user profile
 */
async function verifyGoogleToken(token: string): Promise<{
  id: string;
  email: string;
  name: string;
  picture?: string;
} | null> {
  try {
    // Google's token info endpoint
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`
    );
    
    if (!response.ok) {
      console.error("Google token verification failed");
      return null;
    }
    
    const data = await response.json();
    
    return {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
  } catch (error) {
    console.error("Google token verification error:", error);
    return null;
  }
}

/**
 * Verify Facebook OAuth token and get user profile
 */
async function verifyFacebookToken(token: string): Promise<{
  id: string;
  email: string;
  name: string;
  picture?: string;
} | null> {
  try {
    // Verify token and get user info
    const [verifyResponse, userResponse] = await Promise.all([
      fetch(`https://graph.facebook.com/v18.0/me?access_token=${token}&fields=id,name,email,picture.width(200).height(200)`),
      fetch(`https://graph.facebook.com/v18.0/me?access_token=${token}&fields=id,name,email,picture.width(200).height(200)`)
    ]);
    
    if (!verifyResponse.ok) {
      console.error("Facebook token verification failed");
      return null;
    }
    
    const data = await verifyResponse.json();
    
    return {
      id: data.id,
      email: data.email || `${data.id}@facebook.com`,
      name: data.name,
      picture: data.picture?.data?.url,
    };
  } catch (error) {
    console.error("Facebook token verification error:", error);
    return null;
  }
}

/**
 * Find or create user for social login
 */
async function findOrCreateSocialUser(
  db: any,
  provider: "google" | "facebook",
  profile: { id: string; email: string; name: string; picture?: string }
) {
  const usersCollection = db.collection("users");
  
  // First, try to find by provider + providerId
  let user = await usersCollection.findOne({
    provider,
    providerId: profile.id,
  });

  // If not found, try to find by email (in case user previously registered with same email)
  if (!user) {
    user = await usersCollection.findOne({
      email: profile.email.toLowerCase(),
    });

    if (user) {
      // Link existing account to social provider
      await usersCollection.updateOne(
        { _id: user._id },
        {
          $set: {
            provider,
            providerId: profile.id,
            avatar: profile.picture || user.avatar,
            emailVerified: true,
          }
        }
      );
      user = await usersCollection.findOne({ _id: user._id });
    }
  }

  // If still not found, create new user
  if (!user) {
    const newUser = {
      name: profile.name,
      email: profile.email.toLowerCase(),
      password: null, // No password for social login
      phone: "",
      role: "user",
      status: "active",
      avatar: profile.picture || "",
      provider,
      providerId: profile.id,
      isEmailVerified: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };

    const result = await usersCollection.insertOne(newUser);
    user = { ...newUser, _id: result.insertedId };
  }

  return user;
}

/**
 * Generate auth tokens for user
 */
function generateAuthTokens(user: any) {
  const accessToken = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id.toString(),
    },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

// ============ Google OAuth Routes ============

/**
 * GET /api/auth/google
 * Redirect to Google OAuth consent screen
 */
export async function GET_google(request: NextRequest) {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", crypto.randomUUID());
  googleAuthUrl.searchParams.set("access_type", "offline");
  googleAuthUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(googleAuthUrl.toString());
}

/**
 * GET /api/auth/google/callback
 * Handle Google OAuth callback
 */
export async function GET_google_callback(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=google_auth_failed`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`
      );
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      console.error("Failed to exchange Google code for tokens");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=token_exchange_failed`
      );
    }

    const tokens = await tokenResponse.json();
    const idToken = tokens.id_token;

    // Verify and get user profile
    const profile = await verifyGoogleToken(idToken);
    if (!profile) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_token`
      );
    }

    // Connect to database
    await client.connect();
    db = getDb();

    // Find or create user
    const user = await findOrCreateSocialUser(db, "google", profile);

    // Generate tokens
    const { accessToken, refreshToken } = generateAuthTokens(user);

    // Update last login
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date().toISOString(), refreshToken } }
    );

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
    redirectUrl.searchParams.set("token", accessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error("Google callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=server_error`
    );
  } finally {
    if (db) await client.close();
  }
}

// ============ Facebook OAuth Routes ============

/**
 * GET /api/auth/facebook
 * Redirect to Facebook OAuth consent screen
 */
export async function GET_facebook(request: NextRequest) {
  const facebookAuthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  facebookAuthUrl.searchParams.set("client_id", FACEBOOK_APP_ID);
  facebookAuthUrl.searchParams.set("redirect_uri", FACEBOOK_REDIRECT_URI);
  facebookAuthUrl.searchParams.set("state", crypto.randomUUID());
  facebookAuthUrl.searchParams.set("scope", "public_profile,email");

  return NextResponse.redirect(facebookAuthUrl.toString());
}

/**
 * GET /api/auth/facebook/callback
 * Handle Facebook OAuth callback
 */
export async function GET_facebook_callback(request: NextRequest) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=facebook_auth_failed`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=no_code`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${FACEBOOK_REDIRECT_URI}&code=${code}`
    );

    if (!tokenResponse.ok) {
      console.error("Failed to exchange Facebook code for tokens");
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=token_exchange_failed`
      );
    }

    const tokens = await tokenResponse.json();
    const accessToken = tokens.access_token;

    // Get user profile
    const profile = await verifyFacebookToken(accessToken);
    if (!profile) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=invalid_token`
      );
    }

    // Connect to database
    await client.connect();
    db = getDb();

    // Find or create user
    const user = await findOrCreateSocialUser(db, "facebook", profile);

    // Generate tokens
    const authTokens = generateAuthTokens(user);

    // Update last login
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date().toISOString(), refreshToken: authTokens.refreshToken } }
    );

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
    redirectUrl.searchParams.set("token", authTokens.accessToken);
    redirectUrl.searchParams.set("refreshToken", authTokens.refreshToken);

    return NextResponse.redirect(redirectUrl.toString());

  } catch (error) {
    console.error("Facebook callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=server_error`
    );
  } finally {
    if (db) await client.close();
  }
}
