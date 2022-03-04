import { Author, Comment, Content } from "~/components/organisms/post";
import { Post } from "~/models";

type PostViewProps = {
  data: Post;
};

export default function PostView({ data: post }: PostViewProps) {
  return (
    <>
      <Author data={post.author} />
      <Content data={post} />
      <Comment />
    </>
  );
}
