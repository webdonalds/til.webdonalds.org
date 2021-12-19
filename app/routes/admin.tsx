import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { Header } from "~/components/header";
import { authenticator } from "~/services/auth.server";
import { AdminUser } from "~/models";

export const loader: LoaderFunction = async ({ request }) => {
  const authedUser = await authenticator.isAuthenticated(request);
  if (!authedUser) {
    await authenticator.authenticate("auth0", request);
  } else {
    return json(authedUser);
  }
};

export default function Admin() {
  const user = useLoaderData<AdminUser>();
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
