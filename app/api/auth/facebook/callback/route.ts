import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import client, { getDb } from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "karnel-travels-secret-key";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "karnel-travels-refresh-secret-key";
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "";
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || "http://localhost:3000/api/auth/facebook/callback";

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
    const response = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${token}&fields=id,name,email,picture.width(200).height(200)`
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
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
  let user = await usersCollection.findOne({ provider, providerId: profile.id });

  // If not found, try to find by email
  if (!user) {
    user = await usersCollection.findOne({ email: profile.email.toLowerCase() });

    if (user) {
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
      password: null,
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
    { userId: user._id.toString(), email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id.toString() },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

/**
 * GET /api/auth/facebook/callback
 * Handle Facebook OAuth callback
 */
export async function GET(request: NextRequest) {
  let db;
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/login?error=facebook_auth_failed`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${FACEBOOK_REDIRECT_URI}&code=${code}`
    );

    if (!tokenResponse.ok) {
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
    const { accessToken: newAccessToken, refreshToken } = generateAuthTokens(user);

    // Update last login
    await db.collection("users").updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date().toISOString(), refreshToken } }
    );

    // Redirect to frontend with tokens
    const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`);
    redirectUrl.searchParams.set("token", newAccessToken);
    redirectUrl.searchParams.set("refreshToken", refreshToken);

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
