import { json, LoaderFunction, Outlet, useLoaderData } from "remix";
import { gql } from "@urql/core";
import { v4 as uuidv4 } from "uuid";
import { Header } from "~/components/organisms/header";
import { AdminUserContext } from "~/contexts/AdminUser";
import { authenticator } from "~/services/auth.server";
import { client } from "~/lib/api/client.server";

const query = gql`
  query($authId: String) {
    webdonalds_users(where: { auth_id: { _eq: $authId } }) {
      id
      auth_id
    }
  }
`;

const mutation = gql`
  mutation($authId: String, $uuid: String, $displayName: String) {
    insert_webdonalds_users_one(object: {
      uuid: $uuid,
      auth_id: $authId,
      display_name: $displayName,
    }) {
      id
      auth_id
    }
  }
`;

async function getUser(authId: string): Promise<AdminUserContext> {
  const { data } = await client.query(query, { authId }).toPromise();
  if (data.webdonalds_users.length === 0) {
    return;
  }

  return {
    id: data.webdonalds_users[0].id,
    authId: data.webdonalds_users[0].auth_id,
  };
}

async function registerUser(authId: string, displayName: string): Promise<AdminUserContext> {
  const { data } = await client.mutation(mutation, { authId, displayName, uuid: uuidv4() }).toPromise();
  return data;
}

export const loader: LoaderFunction = async ({ request }) => {
  const authedUser = await authenticator.isAuthenticated(request);
  if (!authedUser) {
    await authenticator.authenticate("auth0", request);
    return;
  }

  const user = (await getUser(authedUser.id)) || (await registerUser(authedUser.id, authedUser.displayName));
  return json(user);
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
