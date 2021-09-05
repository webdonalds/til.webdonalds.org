import React, { Component, ReactElement } from 'react';
import ReactMarkdown from 'react-markdown';
import { PostResponse } from '../../lib/server';
import { query } from '../../lib/server/query';
import { RouteComponentProps } from "react-router-dom";
import Skeleton from 'react-loading-skeleton';

async function queryPost(postId: Number): Promise<PostResponse | null> {
  const data = await query<{ til_posts: PostResponse[] }>(`
    query {
      til_posts(where: { id: { _eq: ${postId} } }) {
        id
        title
        content
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
    }`
  );
  return data.data.til_posts.length === 1 ? data.data.til_posts[0] : null;
}

class Post extends Component<RouteComponentProps, { post: PostResponse | null, loaded: Boolean }> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = { post: null, loaded: false };
  }

  async componentDidMount() {
    const { id } = this.props.match.params as { id: string };
    this.setState({
      post: await queryPost(parseInt(id)),
      loaded: true,
    })
  }

  render() {
    const { loaded, post } = this.state;
    let content: ReactElement;
    if (loaded && !post) {
      content =
        <div className="text-center">
          <p className="m-8 text-8xl">✋</p>
          <p className="m-4 font-bold text-2xl">해당하는 주소를 찾을 수 없어요.</p>
        </div>
    } else {
      content =
        <div className="bg-white rounded-xl shadow-lg">
          {post ? (
            <div>
              <div className="px-6 md:px-8 py-8 border-b border-gray-300">
                <p className="text-sm space-x-1">
                  {post.tags.map(tag => <span>#{tag.tag.name}</span>)}
                </p>
                <p className="py-2 text-2xl font-bold text-gray-900">{post.title}</p>
                <div className="prose max-w-none">
                  <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
              </div>

              <div className="flex p-6 md:px-8 items-center text-base">
                <img className="h-5 w-5 rounded-full mr-1"
                     src={post.author.profile_image || '/blank-profile.webp'}
                     alt={`${post.author.display_name}의 프로필 이미지`}/>
                <span>{post.author.display_name}</span>
              </div>
            </div>
          ) : (
            <div className="px-6 md:px-8 py-8">
              <Skeleton count={5}/>
            </div>
          )}
        </div>
    }

    return (
      <div className="max-w-6xl mx-auto px-2 md:px-4">
        <div className="px-4 py-12 md:py-16">
          <p className="text-4xl md:text-5xl font-bold text-gray-900">Today I Learned</p>
        </div>

        {content}
      </div>
    );
  }
}

export default Post;
