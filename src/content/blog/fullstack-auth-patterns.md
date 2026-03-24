---
title: "Authentication Patterns in Next.js: JWT, Sessions, and OAuth 2.0"
date: "2026-03-24"
description: "A practical comparison of JWT vs session-based auth in Next.js, with real implementation patterns for OAuth 2.0 with NextAuth, secure cookie handling, and refresh token rotation."
slug: "fullstack-auth-patterns"
published: true
tags: ["Frontend", "Backend", "Security", "Next.js"]
author: "Dao Quang Truong"
coverImage: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1000"
---

Authentication is one of those things that's easy to get wrong in ways that aren't immediately obvious. I've implemented auth in Next.js projects ranging from simple JWTs to full OAuth 2.0 flows with refresh token rotation, and each time I've learned something new about the trade-offs. This post is the guide I wish I'd had: clear explanations of the options, concrete code for each pattern, and opinionated guidance on when to use what.

## JWT vs Sessions: The Core Trade-Off

This is the foundational decision, and it's worth understanding deeply before reaching for a library.

**JWT (JSON Web Tokens)** are self-contained. The token itself carries the user's claims (user ID, roles, expiry). The server can verify a JWT without any database lookup — it just validates the signature. This makes JWTs attractive for stateless APIs and microservices.

The downside is revocation. If you issue a JWT with a 1-hour expiry and the user's account gets compromised, you can't invalidate that JWT before it expires. You'd need a token blocklist (a database of revoked tokens), which reintroduces server-side state and partially defeats the purpose.

**Session-based auth** stores the session server-side (usually in a database or Redis). The client gets a session ID cookie. Every request looks up the session in the server store. This is stateful, but revocation is instant — delete the session record and the user is logged out immediately.

My rule of thumb:
- **JWT**: Stateless APIs, short-lived tokens (minutes), microservices communication
- **Sessions**: Full-stack web apps, user dashboards, anything requiring instant revocation

For most Next.js applications I build, **sessions win**. The "stateless" benefit of JWT is rarely worth the revocation complexity for a web app with a database already in the stack.

## Implementing Sessions with NextAuth

NextAuth (Auth.js) is my go-to for Next.js authentication. It handles the session lifecycle, CSRF protection, and OAuth flows out of the box.

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: "database",  // Store sessions in DB, not JWT
    maxAge: 30 * 24 * 60 * 60,  // 30 days
  },
  callbacks: {
    session({ session, user }) {
      // Add custom fields to session
      session.user.id = user.id
      session.user.role = user.role
      return session
    }
  }
})
```

With `strategy: "database"`, NextAuth stores sessions in your database via the adapter. Signing out a user server-side is a single database delete. The session ID is stored in a `__Secure-next-auth.session-token` cookie with `HttpOnly`, `Secure`, and `SameSite=Lax` attributes — handled automatically.

## OAuth 2.0 Flow: What Actually Happens

Understanding the OAuth 2.0 flow helps debug the inevitable issues. Here's what happens when a user clicks "Sign in with Google":

1. Your app redirects to Google's authorization endpoint with `client_id`, `redirect_uri`, `scope`, and a `state` parameter (CSRF protection)
2. The user authenticates with Google and approves your app's requested scopes
3. Google redirects back to your `redirect_uri` with an authorization `code`
4. Your server exchanges the code for tokens at Google's token endpoint (server-to-server, never exposed to browser)
5. Google returns an `access_token` (short-lived), `id_token` (user info JWT), and optionally a `refresh_token`
6. Your app creates a session for the authenticated user

NextAuth handles all of this. But knowing the flow helps when OAuth is misconfigured (wrong redirect URI, missing scopes) or when you need to implement it manually for a custom provider.

## Secure Cookie Configuration

If you're implementing auth without NextAuth, cookie security deserves explicit attention:

```ts
// Secure cookie settings
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,      // Inaccessible to JavaScript — prevents XSS theft
  secure: process.env.NODE_ENV === "production",  // HTTPS only in prod
  sameSite: "lax" as const,  // Protects against CSRF
  maxAge: 60 * 60 * 24 * 30,  // 30 days in seconds
  path: "/"
}

export async function createSession(userId: string) {
  const sessionToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET!))
  
  cookies().set("session", sessionToken, SESSION_COOKIE_OPTIONS)
}
```

The three non-negotiables for session cookies:
- `HttpOnly`: Prevents JavaScript from reading the cookie — this is your primary XSS defense for auth tokens
- `Secure`: Only sent over HTTPS — non-negotiable in production
- `SameSite=Lax`: Prevents the browser from sending the cookie on cross-site requests (CSRF protection)

## Middleware-Based Route Protection

In the Next.js App Router, the cleanest way to protect routes is with middleware that runs before any page renders:

```ts
// middleware.ts
import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl
  
  // Protected routes pattern
  const isProtectedRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/admin")
  
  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Role-based access
  if (pathname.startsWith("/admin") && session?.user.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/account/:path*", "/admin/:path*"]
}
```

The `matcher` config limits which routes the middleware runs on — don't run auth checks on static assets or public pages, as it adds latency to every request.

## Refresh Token Rotation

If you're using JWTs (or OAuth tokens with expiry), refresh token rotation is essential security hygiene. The pattern:

1. Issue a short-lived access token (15-60 minutes)
2. Issue a long-lived refresh token (30 days)
3. When the access token expires, use the refresh token to get a new access token — and **issue a new refresh token** (rotating it)
4. Invalidate the old refresh token

The rotation means a stolen refresh token has a limited window: the next time your legitimate user uses it to refresh, the old one is invalidated. If the attacker uses it first, your user's next refresh attempt fails and they're logged out — and you've detected the compromise.

```ts
export async function rotateRefreshToken(oldRefreshToken: string) {
  // Verify the refresh token
  const tokenRecord = await db.refreshToken.findUnique({
    where: { token: oldRefreshToken }
  })
  
  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    throw new Error("Invalid or expired refresh token")
  }
  
  // Check for token reuse (sign of theft)
  if (tokenRecord.used) {
    // Revoke all tokens for this user — possible compromise
    await db.refreshToken.deleteMany({ where: { userId: tokenRecord.userId } })
    throw new Error("Refresh token reuse detected — all sessions revoked")
  }
  
  // Mark as used and issue new tokens
  await db.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { used: true }
  })
  
  const newAccessToken = generateAccessToken(tokenRecord.userId)
  const newRefreshToken = await generateRefreshToken(tokenRecord.userId)
  
  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}
```

The reuse detection (if `tokenRecord.used` is already true) is the key security primitive. Legitimate users never use a refresh token twice. If one is reused, it signals a theft and you revoke everything for that user.

## What I Reach For

For projects with social login (Google, GitHub): **NextAuth with database sessions**. It's mature, secure by default, and handles all the OAuth complexity.

For internal APIs or services: **short-lived JWTs** with a token blocklist for revocation.

For anything involving real money or sensitive data: **database sessions + refresh token rotation + refresh on every request validation**. Don't cut corners.

Auth is one place where "good enough for a demo" is genuinely dangerous in production. The patterns here are battle-tested — use them as starting points, not endpoints.
