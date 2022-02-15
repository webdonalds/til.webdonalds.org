import { json, LoaderFunction } from "remix";
import { gql } from "@urql/core";
import dayjs from "dayjs";
import { client } from "~/lib/api/client";

type SitemapData = {
  til_posts: {
    id: number;
    created_at: string;
  }[];
};

const query = gql<SitemapData>`
  query @cached {
    til_posts(order_by: { id: desc }) {
      id
      created_at
    }
  }
`;

const xmlPrefix = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const xmlPostfix = `</urlset>`;

export const loader: LoaderFunction = async () => {
  const { data } = await client.query<SitemapData>(query).toPromise();
  if (!data) {
    throw json(null, { status: 500 });
  }

  const xmlUrls = data.til_posts.map((post) => {
    const createdAt = dayjs(post.created_at);
    return `
    <url>
      <loc>https://til.webdonalds.org/posts/${post.id}</loc>
      <lastmod>${createdAt.format("YYYY-MM-DD")}</lastmod>
      <priority>${(1.0 + 0.1 * createdAt.diff(new Date(), "year")).toFixed(1)}</priority>
    </url>
    `;
  }).join("\n");

  const sitemap = `
  ${xmlPrefix}
  ${xmlUrls}
  ${xmlPostfix}
  `.trimStart();

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "xml-version": "1.0",
      "encoding": "UTF-8",
    },
  });
};
