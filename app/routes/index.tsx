import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { gql } from "@urql/core";
import { Header } from "~/components/header";
import { PostItem } from "~/components/postlist";
import { client } from "~/lib/api/client";

type IndexData = {
  til_posts: {
    id: number;
    title: string;
    tags: {
      tag: {
        name: string;
        slug: string;
      };
    }[];
    author: {
      display_name: string;
      profile_image: string;
    };
  }[];
};

const query = gql<IndexData>`
  query @cached {
    til_posts(limit: 10, order_by: { id: desc }) {
      id
      title
      tags {
        tag {
          name
          slug
        }
      }
      author {
        display_name
        profile_image
      }
    }
  }
`;

export const loader: LoaderFunction = async () => {
  const { data } = await client.query(query).toPromise();
  return json(data);
};

export default function Index() {
  const data = useLoaderData<IndexData>();
  return (
    <>
      <Header />
      <p className="text-4xl font-bold text-gray-900">최신 글</p>
      <div className="my-8">
        {data.til_posts.map((post) => (
          <PostItem
            post={{
              id: post.id,
              title: post.title,
              author: {
                name: post.author.display_name,
                profileUrl: post.author.profile_image,
              },
              tags: post.tags.map((t) => t.tag),
            }}
          />
        ))}
      </div>
    </>
  );
}
