import { Link } from "@remix-run/react";
import dayjs from "dayjs";

type PostListItemProp = {
  id: number;
  title: string;
  author?: {
    id: number;
    name: string;
    profileUrl: string;
  };
  tags: {
    name: string;
    slug: string;
  }[];
  createdAt: Date;
};

export const PostListItem = ({ post }: { post: PostListItemProp }) => (
  <div className="pb-8" key={`post-${post.id}`}>
    {/* 태그 영역 */}
    <div className="text-sm space-x-2">
      {post.tags.map((tag) => (
        <span key={`tag-${tag.slug}`}>#{tag.name}</span>
      ))}
    </div>

    {/* 제목 영역 */}
    <Link to={`/posts/${post.id}`}>
      <p className="my-2 text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 hover:opacity-75 hover:underline transition">
        {post.title}
      </p>
    </Link>

    {/* 작성자 영역 */}
    <div className="my-2 flex items-center text-base">
      {post.author && (
        <>
          <Link className="hover:underline" to={`/authors/${post.author.id}`}>
            <div className="flex items-center">
              <img
                className="inline h-6 w-6 rounded-full mr-2"
                src={post.author.profileUrl}
                alt={`${post.author.name}의 프로필 이미지`}
              />
              <span>{post.author.name}</span>
            </div>
          </Link>
          <span className="px-1">|</span>
        </>
      )}
      <span>{dayjs(post.createdAt).format("YYYY. MM. DD.")}</span>
    </div>
  </div>
);
