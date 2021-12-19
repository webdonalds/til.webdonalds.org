import { createClient } from "@urql/core";

export const client = createClient({
  url: "https://engaging-mustang-19.hasura.app/v1/graphql",
  fetchOptions: {
    headers: {
      "X-Hasura-Admin-Secret": process.env.HASURA_ADMIN_SECRET || "",
    },
  },
});
