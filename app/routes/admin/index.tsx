import { Form, json, Link, LoaderFunction, useLoaderData } from "remix";
import { gql } from "@urql/core";
import { client } from "~/lib/api/client";
import { Button } from "~/components/atoms";
import { authenticator } from "~/services/auth.server";

type AdminIndexData = {
  til_posts: {
    id: number;
    title: string
  }[];
};

type AdminIndexProp = {
  id: number;
  title: string;
}[];

const query = gql<AdminIndexData>`
  query($authId: String) @cached {
    til_posts(
      where: { author: { auth_id: { _eq: $authId } } },
      order_by: { id: asc },
    ) {
      id
      title
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const authedUser = await authenticator.isAuthenticated(request);
  const { data } = await client.query(query, { authId: authedUser!!.id }).toPromise();
  if (!data) {
    throw json(null);
  }
  return json(data.til_posts);
};

export default function AdminIndex() {
  const posts = useLoaderData<AdminIndexProp>();
  return (
    <>
      <p className="text-4xl font-bold text-gray-900">관리자 화면</p>
      <div className="flex py-8 space-x-1">
        <Link to="/admin/profile">
          <Button text="프로필 편집" />
        </Link>
        <Form action="/callbacks/logout" method="post">
          <Button text="로그아웃" color="red" />
        </Form>
      </div>

      <p className="py-4 text-2xl font-bold text-gray-900">내 글 목록</p>
      {posts.map((post) => (
        <div className="py-1 space-x-1" key={`post-${post.id}`}>
          <Link to={`/posts/${post.id}`}>
            <Button text="보기" />
          </Link>
          <Link to={`/admin/posts/${post.id}`}>
            <Button text="편집" />
          </Link>
          <span className="pl-2">
            {post.title}
          </span>
        </div>
      ))}
    </>
  );
}
