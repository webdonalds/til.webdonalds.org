import { Authenticator, Strategy } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { sessionStorage } from "~/services/session.server";
import { Auth0User } from "~/models";

export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN!!,
  clientID: process.env.AUTH0_CLIENT_ID!!,
  clientSecret: process.env.AUTH0_CLIENT_SECRET!!,
  callbackURL: process.env.AUTH0_CALLBACK_URL!!,
  logoutURL: process.env.AUTH0_LOGOUT_URL!!,
};

export const authenticator = new Authenticator<Auth0User>(sessionStorage);

authenticator.use(
  new Auth0Strategy<Auth0User>(auth0Config, async ({ profile }) => {
    return {
      id: profile.id,
      displayName: profile.displayName,
    };
  }) as Strategy<Auth0User, never>,
  "auth0",
);
