import { createClient } from "@urql/core";

const adminSecret = process.env.HASURA_ADMIN_SECRET;
const headers = adminSecret ? { "X-Hasura-Admin-Secret": adminSecret } : {};

export const client = createClient({
  url: "https://engaging-mustang-19.hasura.app/v1/graphql",
  fetchOptions: { headers },
});
