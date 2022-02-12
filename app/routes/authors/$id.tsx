import { json, LoaderFunction, useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { gql } from "@urql/core";
import { client } from "~/lib/api/client";
import { HeadingSubtitle, HeadingTitle } from "~/components/atoms/heading";
import { OuterLink } from "~/components/molecules/link";
import { PostListItem } from "~/components/organisms/postlist";

type AuthorData = {
  webdonalds_users: {
    display_name: string;
    profile_image: string;
    blog_url: string | null;
    github_id: string | null;
    twitter_id: string | null;
    instagram_id: string | null;
  }[];
  til_posts: {
    id: number;
    title: string;
    created_at: string;
    tags: {
      tag: {
        name: string;
        slug: string;
      };
    }[];
  }[];
}

type AuthorProps = {
  name: string;
  profileUrl: string;
  blogUrl: string | null;
  githubId: string | null;
  twitterId: string | null;
  instagramId: string | null;
  posts: {
    id: number;
    title: string;
    createdAt: string;
    tags: {
      name: string;
      slug: string;
    }[];
  }[];
}

const query = gql<AuthorData>`
  query ($authorId: bigint!) @cached {
    webdonalds_users(where: { id: { _eq: $authorId } }) {
      display_name
      profile_image
      blog_url
      github_id
      twitter_id
      instagram_id
    }
    til_posts(where: { author_id: { _eq: $authorId } }, order_by: { id: desc }) {
      id
      title
      created_at
      tags {
        tag { name slug }
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ params }: DataFunctionArgs) => {
  const { data, error } = await client.query(query, { authorId: params.id }).toPromise();
  if (!data || data.webdonalds_users.length === 0) {
    throw json(null, { status: 404 });
  }

  const author = data.webdonalds_users[0];
  const posts = data.til_posts;
  return json<AuthorProps>({
    name: author.display_name,
    profileUrl: author.profile_image,
    blogUrl: author.blog_url,
    githubId: author.github_id,
    twitterId: author.twitter_id,
    instagramId: author.instagram_id,
    posts: posts.map((p) => ({
      id: p.id,
      title: p.title,
      createdAt: p.created_at,
      tags: p.tags.map((t) => t.tag),
    })),
  });
};

export default function Author() {
  const { name, profileUrl, blogUrl, githubId, twitterId, instagramId, posts } = useLoaderData<AuthorProps>();
  return (
    <>
      <div className="md:my-8">
        <img className="my-4 mx-auto h-24 w-24 md:h-36 md:w-36 rounded-full"
             src={profileUrl}
             alt={`${name}의 프로필 이미지`}
        />
        <p className="my-2 text-center text-3xl md:text-4xl font-bold">{name}</p>
        <p className="text-center text-base space-x-2">
          {blogUrl && <OuterLink url={blogUrl}>블로그</OuterLink>}
          {githubId && <OuterLink url={`https://github.com/${githubId}`}>깃허브</OuterLink>}
          {twitterId && <OuterLink url={`https://twitter.com/${twitterId}`}>트위터</OuterLink>}
          {instagramId && <OuterLink url={`https://instagram.com/${instagramId}`}>인스타그램</OuterLink>}
        </p>
      </div>

      <HeadingTitle className="py-8">작성한 글</HeadingTitle>
      <div>
        {posts.map((post) => (
          <PostListItem
            key={`post-${post.id}`}
            post={{
              id: post.id,
              title: post.title,
              tags: post.tags,
              createdAt: new Date(post.createdAt),
            }}
          />
        ))}
      </div>
    </>
  );
}
