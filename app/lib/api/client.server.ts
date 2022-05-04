import { cacheExchange, createClient, dedupExchange, fetchExchange } from "@urql/core";
import { requestPolicyExchange } from "@urql/exchange-request-policy";

const adminSecret = process.env.HASURA_ADMIN_SECRET;
const headers: Record<string, string> = adminSecret ? { "X-Hasura-Admin-Secret": adminSecret } : {};

export const client = createClient({
  url: "https://engaging-mustang-19.hasura.app/v1/graphql",
  fetchOptions: { headers },
  exchanges: [
    dedupExchange,
    requestPolicyExchange({ ttl: 60_000, shouldUpgrade: () => true }),
    cacheExchange,
    fetchExchange,
  ],
});
