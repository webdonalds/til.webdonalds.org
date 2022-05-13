import { createCookieSessionStorage } from "@remix-run/node";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    path: "/",
    sameSite: "lax",
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || "dummy-secret"],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, destroySession } = sessionStorage;
