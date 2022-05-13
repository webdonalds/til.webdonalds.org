import { ActionFunction, redirect } from "@remix-run/node";
import { auth0Config } from "~/services/auth.server";
import { destroySession, getSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const { domain, clientID, logoutURL } = auth0Config;
  return redirect(
    `https://${domain}/v2/logout?client_id=${clientID}&returnTo=${logoutURL}`,
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    },
  );
};
