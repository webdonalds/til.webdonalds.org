import { json, LoaderFunction, useCatch, useLoaderData } from "remix";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import { gql } from "@urql/core";
import { marked } from "marked";
import { client } from "~/lib/api/client";
import { ErrorMessage } from "~/components/templates/error";

type PostData = {
  til_posts: {
    title: string;
    content: string;
    author: {
      display_name: string;
      profile_image: string;
    };
  }[];
};

type PostProp = {
  title: string;
  content: string;
  author: {
    name: string;
    profileUrl: string;
  };
};

const query = gql<PostData>`
  query($postId: bigint) @cached {
    til_posts(where: { id: { _eq: $postId } }, order_by: { id: desc }, limit: 1) {
      title
      content
      author {
        display_name
        profile_image
      }
    }
  }
`;

export const loader: LoaderFunction = async (args: DataFunctionArgs) => {
  const { data } = await client.query(query, { postId: args.params.id }).toPromise();
  if (!data || data.til_posts.length === 0) {
    throw json(null, { status: 404 });
  }

  const post = data.til_posts[0];
  return json({
    title: post.title,
    content: post.content,
    author: {
      name: post.author.display_name,
      profileUrl: post.author.profile_image,
    },
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

export default function Post() {
  const { title, content, author } = useLoaderData<PostProp>();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="px-6 md:px-8 py-8 border-b border-gray-100">
        <p className="py-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </p>
        <article className="prose dark:prose-dark max-w-none">
          <div dangerouslySetInnerHTML={{ __html: marked(content) }} />
        </article>
      </div>
      <div className="flex p-6 md:px-8 items-center text-base">
        <img className="h-5 w-5 rounded-full mr-2"
             src={author.profileUrl}
             alt={`${author.name}의 프로필 이미지`} />
        <span>{author.name}</span>
      </div>
    </div>
  );
}
