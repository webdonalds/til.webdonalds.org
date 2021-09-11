import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PostResponse } from '../lib/server';
import { query } from '../lib/server/query';
import { RouteComponentProps } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

async function queryPosts(): Promise<PostResponse[]> {
  const data = await query<{ til_posts: PostResponse[] }>(`
    query {
      til_posts(limit: 10, order_by: { id: desc }) {
        id
        title
        tags {
          tag {
            name
            slug
          }
        }
        author {
          display_name
          profile_image
        }
      }
    }
  `);
  return data.data.til_posts;
}

class Index extends Component<RouteComponentProps, { posts: PostResponse[], loaded: Boolean }> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { posts: [], loaded: false };
  }

  async componentDidMount() {
    this.setState({
      posts: await queryPosts(),
      loaded: true,
    });
  }

  render() {
    const { loaded, posts } = this.state;
    if (loaded && (!posts || posts.length === 0)) {
      return (
        <div className="text-center">
          <p className="m-8 text-8xl">🤔</p>
          <p className="m-4 font-bold text-2xl">문제가 발생했어요. 잠시 후 다시 시도해주세요.</p>
        </div>
      );
    }

    return (
      <div>
        <p className="py-4 text-4xl font-bold text-gray-900">최신 글</p>
        {loaded ? (
          <div className="my-8">
            {posts.map((post) => (
              <div className="mb-12" key={`post-${post.id}`}>
                <p className="text-sm space-x-2">
                  {post.tags.map(tag => <span>#{tag.tag.name}</span>)}
                </p>
                <Link to={`/posts/${post.id}`}>
                  <p className="my-2 text-2xl font-bold hover:text-gray-900 hover:underline transition">
                    {post.title}
                  </p>
                </Link>
                <div className="flex items-center text-sm">
                  <img className="h-4 w-4 rounded-full mr-1"
                       src={post.author.profile_image || '/blank-profile.webp'}
                       alt={`${post.author.display_name}의 프로필 이미지`}/>
                  <span>{post.author.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Skeleton count={3} />
          </div>
        )
        }
      </div>
    )
  }
}

export default Index;
