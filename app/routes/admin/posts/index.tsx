import { ActionFunction, Form, redirect, useOutletContext } from "remix";
import { gql } from "@urql/core";
import { PostEditor } from "~/components/organisms/postedit";
import { AdminUserContext } from "~/contexts/AdminUser";
import { client } from "~/lib/api/client";

const mutation = gql`
  mutation($title: String, $content: String, $authorId: bigint) {
    insert_til_posts_one(object: {
      title: $title
      content: $content
      author_id: $authorId
    }) {
      id
    }
  }
`;

export const action: ActionFunction = async ({ request }) => {
  const reqData = await request.formData();
  const title = reqData.get("title");
  const content = reqData.get("content");
  const authorId = reqData.get("authorId");

  const { data, error } = await client.mutation(mutation, {
    title, content, authorId,
  }).toPromise();

  if (error) {
    return { error };
  }
  return redirect(`/posts/${data.insert_til_posts_one.id}`);
};

export default function CreatePost() {
  const { id: authorId } = useOutletContext<AdminUserContext>();
  return (
    <>
      <p className="py-4 text-2xl font-bold text-gray-900">새 글 쓰기</p>
      <Form method="post">
        <PostEditor authorId={authorId} />
      </Form>
    </>
  );
}
