import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useOutletContext } from "@remix-run/react";
import { gql } from "@urql/core";
import { AdminUserContext } from "~/contexts/AdminUser";
import { HeadingSubtitle } from "~/components/atoms/heading";
import { PostEditor } from "~/components/templates/post-editor";
import { client } from "~/lib/api/client.server";
import { Post } from "~/models";
import monokai from "highlight.js/styles/monokai.css";

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
  const { data } = await client.query(query, { postId: params.id }).toPromise();
  return json<Post>(data.til_posts[0]);
};

export const action: ActionFunction = async ({ request, params }) => {
  const reqData = await request.formData();
  const title = reqData.get("title");
  const content = reqData.get("content");
  const authorId = reqData.get("authorId");

  const { error } = await client.mutation(mutation, {
    postId: params.id,
    title,
    content,
    authorId,
  }).toPromise();

  if (error) {
    return { error };
  }
  return redirect("/admin");
};

export function links() {
  return [
    { rel: "stylesheet", href: monokai },
  ];
}

export default function CreatePost() {
  const { id: authorId } = useOutletContext<AdminUserContext>();
  const post = useLoaderData<Post>();
  return (
    <>
      <HeadingSubtitle>글 고치기</HeadingSubtitle>
      <Form method="post">
        <PostEditor authorId={authorId} initData={post} />
      </Form>
    </>
  );
}
