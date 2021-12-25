import { Auth0Strategy, Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { AdminUser } from "~/models";

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!!,
  clientID: process.env.AUTH0_CLIENT_ID!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  callbackURL: process.env.AUTH0_CALLBACK_URL!!,
  logoutURL: process.env.AUTH0_LOGOUT_URL!!,
};

export const authenticator = new Authenticator<AdminUser>(sessionStorage);

authenticator.use(
  new Auth0Strategy<AdminUser>(auth0Config, async (_1, _2, _3, profile) => {
    return { id: profile.id };
  }),
  "auth0",
);
