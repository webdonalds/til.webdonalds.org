import { createClient } from "@urql/core";

export const client = createClient({
  url: "https://til-server.webdonalds.org/graphql",
});
