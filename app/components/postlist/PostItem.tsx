import { Link } from "remix";

type PostItemProp = {
  id: number;
  title: string;
  author: {
    name: string;
    profileUrl: string;
  };
  tags: {
    name: string;
    slug: string;
  }[];
};

export const PostItem = ({ post } : { post: PostItemProp }) => (
  <div className="my-8 mb-12" key={`post-${post.id}`}>
    {/* 태그 영역 */}
    <div className="text-sm space-x-2">
      {
        post.tags.map((tag) => (
          <span key={`tag-${tag.slug}`}>#{tag.name}</span>
        ))
      }
    </div>

    {/* 제목 영역 */}
    <Link to={`/post/${post.id}`}>
      <p className="my-2 text-2xl font-bold hover:text-gray-900 hover:underline transition">{post.title}</p>
    </Link>

    {/* 작성자 영역 */}
    <div className="flex items-center text-sm">
      <img className="h-4 w-4 rounded-full mr-1"
           src={post.author.profileUrl}
           alt={`${post.author.name}의 프로필 이미지`}
      />
      <span>{post.author.name}</span>
    </div>
  </div>
);
