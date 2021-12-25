import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { gql } from "@urql/core";
import { Header } from "~/components/organisms/header";
import { AdminUserContext } from "~/contexts/AdminUser";
import { authenticator } from "~/services/auth.server";
import { client } from "~/lib/api/client";

const query = gql`
  query($authId: String) {
    webdonalds_users(where: { auth_id: { _eq: $authId } }) {
      id
      auth_id
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const authedUser = await authenticator.isAuthenticated(request);
  if (!authedUser) {
    await authenticator.authenticate("auth0", request);
  } else {
    const { data } = await client.query(query, { authId: authedUser.id }).toPromise();
    const user = data.webdonalds_users[0];
    return json({
      id: user.id,
      authId: user.auth_id,
    });
  }
};

export default function Admin() {
  const user = useLoaderData<AdminUserContext>();
  return (
    <>
      <Header />
      <Outlet context={user} />
    </>
  );
}
