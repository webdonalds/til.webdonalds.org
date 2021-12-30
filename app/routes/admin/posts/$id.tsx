import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  useOutletContext,
} from "remix";
import { gql } from "@urql/core";
import { PostEditor } from "~/components/organisms/postedit";
import { AdminUserContext } from "~/contexts/AdminUser";
import { client } from "~/lib/api/client";
import { HeadingSubtitle } from "~/components/atoms/heading";

type PostProp = {
  title: string;
  content: string;
};

const query = gql`
  query ($postId: bigint) {
    til_posts(where: { id: { _eq: $postId } }) {
      title
      content
    }
  }
`;

const mutation = gql`
  mutation (
    $postId: bigint
    $title: String
    $content: String
    $authorId: bigint
  ) {
    update_til_posts(
      where: { id: { _eq: $postId }, author_id: { _eq: $authorId } }
      _set: { title: $title, content: $content }
    ) {
      returning {
        id
      }
    }
  }
`;

export const loader: LoaderFunction = async ({ params }) => {
  const { data, error } = await client
    .query(query, {
      postId: params.id,
    })
    .toPromise();
  return json(data.til_posts[0]);
};

export const action: ActionFunction = async ({ request, params }) => {
  const reqData = await request.formData();
  const title = reqData.get("title");
  const content = reqData.get("content");
  const authorId = reqData.get("authorId");

  const { error } = await client
    .mutation(mutation, {
      postId: params.id,
      title,
      content,
      authorId,
    })
    .toPromise();

  if (error) {
    return { error };
  }
  return redirect("/admin");
};

export default function CreatePost() {
  const { id: authorId } = useOutletContext<AdminUserContext>();
  const { title, content } = useLoaderData<PostProp>();
  return (
    <>
      <HeadingSubtitle>글 고치기</HeadingSubtitle>
      <Form method="post">
        <PostEditor
          defaultTitle={title}
          defaultContent={content}
          authorId={authorId}
        />
      </Form>
    </>
  );
}
