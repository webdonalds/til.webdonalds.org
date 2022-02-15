import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json, Link } from "remix";
import { gql } from "@urql/core";
import { HeadingTitle } from "~/components/atoms/heading";
import { Header } from "~/components/organisms/header";
import { PostListItem } from "~/components/organisms/postlist";
import { client } from "~/lib/api/client.server";

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
      id: number;
      display_name: string;
      profile_image: string;
    };
    created_at: string;
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
        id
        display_name
        profile_image
      }
      created_at
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
      <>
        {data.til_posts.map((post) => (
          <PostListItem
            key={`post-${post.id}`}
            post={{
              id: post.id,
              title: post.title,
              author: {
                id: post.author.id,
                name: post.author.display_name,
                profileUrl: post.author.profile_image,
              },
              tags: post.tags.map((t) => t.tag),
              createdAt: new Date(post.created_at),
            }}
          />
        ))}
      </>
    </>
  );
}
