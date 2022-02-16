import { json, LoaderFunction, MetaFunction, useCatch, useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { gql } from "@urql/core";
import { marked } from "marked";
import { client } from "~/lib/api/client.server";
import { ErrorMessage } from "~/components/templates/error";
import { Author, Comment } from "~/components/organisms/post";

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

type PostProps = {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    profileUrl: string;
    blogUrl: string | null;
    githubId: string | null;
    twitterId: string | null;
    instagramId: string | null;
    linkedInId: string | null;
  };
  createdAt: Date;
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
  return json<PostProps>({
    title: post.title,
    content: post.content,
    author: {
      id: post.author.id,
      name: post.author.display_name,
      profileUrl: post.author.profile_image,
      blogUrl: post.author.blog_url,
      githubId: post.author.github_id,
      twitterId: post.author.twitter_id,
      instagramId: post.author.instagram_id,
      linkedInId: post.author.linked_in_id,
    },
    createdAt: new Date(post.created_at),
  });
};

export function CatchBoundary() {
  const { status } = useCatch();
  const message = (status === 404) ? "해당하는 주소를 찾을 수 없어요." : "오류가 발생했어요";
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <ErrorMessage emoji="✋" message={message} />
    </div>
  );
}

export const meta: MetaFunction = ({ data }: { data: PostProps }) => {
  const result: { [_: string]: string } = {
    title: `${data.title} | TIL - by WebDonalds`,
    description: `${data.title} | Today I Learned`,
    "og:title": data.title,
    "og:description": `${data.title} | Today I Learned`,
    "twitter:title": data.title,
    "twitter:description": `${data.title} | Today I Learned`,
  };
  if (data.author.twitterId) {
    result["twitter:site"] = `@${data.author.twitterId}`;
  }

  return result;
};

export default function Post() {
  const { title, content, author, createdAt } = useLoaderData<PostProps>();
  return (
    <>
      <Author
        id={author.id}
        name={author.name}
        profileUrl={author.profileUrl}
        blogUrl={author.blogUrl || undefined}
        githubId={author.githubId || undefined}
        twitterId={author.twitterId || undefined}
        instagramId={author.instagramId || undefined}
        linkedInId={author.linkedInId || undefined}
        createdAt={createdAt}
      />
      <div className="my-8 px-6 md:px-8 py-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="my-4 text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </div>
        <article className="prose dark:prose-dark max-w-none">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        </article>
      </div>

      <Comment className="my-8" />
    </>
  );
}
