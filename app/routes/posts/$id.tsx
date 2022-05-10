import { json, LoaderFunction, MetaFunction, useCatch, useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { gql } from "@urql/core";
import { client } from "~/lib/api/client.server";
import { ErrorMessage } from "~/components/templates/error";
import PostView from "~/components/templates/post-viewer";
import { Post } from "~/models";
import monokai from "highlight.js/styles/monokai.css";

type PostData = {
  til_posts: {
    title: string;
    content: string;
    author: {
      id: number;
      display_name: string;
      profile_image: string;
      blog_url: string | null;
      github_id: string | null;
      twitter_id: string | null;
      instagram_id: string | null;
      linked_in_id: string | null;
    };
    created_at: string;
  }[];
};

const query = gql<PostData>`
  query($postId: bigint) {
    til_posts(where: { id: { _eq: $postId } }, order_by: { id: desc }, limit: 1) {
      title
      content
      author {
        id
        display_name
        profile_image
        blog_url
        github_id
        twitter_id
        instagram_id
        linked_in_id
      }
      created_at
    }
  }
`;

export const loader: LoaderFunction = async (args: DataFunctionArgs) => {
  const { data } = await client.query(query, { postId: args.params.id }).toPromise();
  if (!data || data.til_posts.length === 0) {
    throw json(null, { status: 404 });
  }

  const post = data.til_posts[0];
  return json<Post>({
    title: post.title,
    content: post.content,
    author: {
      id: post.author.id,
      name: post.author.display_name,
      profileImageUrl: post.author.profile_image,
      social: {
        blogUrl: post.author.blog_url,
        githubId: post.author.github_id,
        twitterId: post.author.twitter_id,
        instagramId: post.author.instagram_id,
        linkedInId: post.author.linked_in_id,
      },
    },
    createdAt: new Date(post.created_at),
  });
};

export function links() {
  return [
    { rel: "stylesheet", href: monokai },
  ];
}

export function CatchBoundary() {
  const { status } = useCatch();
  const message = (status === 404) ? "해당하는 주소를 찾을 수 없어요." : "오류가 발생했어요.";
  return <ErrorMessage emoji="✋" message={message} />;
}

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {};
  }

  const result: { [_: string]: string } = {
    title: `${data.title} | TIL - by WebDonalds`,
    description: `${data.title} | Today I Learned`,
    "og:title": data.title,
    "og:image": `https://og-images.webdonalds.workers.dev/til/${params.id}`,
    "og:description": "Today I Learned",
    "twitter:title": data.title,
    "twitter:description": "Today I Learned",
    "twitter:card": "summary_large_image",
  };
  if (data.author.twitterId) {
    result["twitter:site"] = `@${data.author.twitterId}`;
  }

  return result;
};

export default function Post() {
  const post = useLoaderData<Post>();
  return <PostView data={post} />;
}
