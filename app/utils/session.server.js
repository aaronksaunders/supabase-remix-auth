import { createCookieSessionStorage } from "remix";

//
// lifted directly from the remix documentation
// https://remix.run/docs/en/v1/api/remix#sessions
//
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the CookieOptions to create one
    cookie: {
      name: "sb:token",

      // all of these are optional
      expires: new Date(Date.now() + 60),
      httpOnly: true,
      maxAge: 60,
      path: "/",
      sameSite: "lax",
      secrets: ["s3cret1"],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };
