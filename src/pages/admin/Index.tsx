import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';
import { RouteWithAuth0Component, RouteWithAuth0Props } from '../../component/RouteWithAuth0Props';
import { PostResponse } from '../../lib/server';
import { query } from '../../lib/server/query';

interface IndexState {
  posts: PostResponse[];
}

class Index extends RouteWithAuth0Component<RouteWithAuth0Props, IndexState> {
  constructor(props: RouteWithAuth0Props) {
    super(props);
    this.state = { posts: [] };
  }

  async componentDidMount() {
    const me = await this.getMe();
    const data = await query<{ til_posts: PostResponse[] }>(`
      query {
        til_posts(where: { author_id: { _eq: ${me.id} } }, order_by: { id: desc }) {
          id
          title
        }
      }
    `, await this.generateToken());

    this.setState({ posts: data.data.til_posts });
  }

  render() {
    const { logout } = this.props.auth0;
    return (
      <>
        <p className="py-4 text-4xl font-bold text-gray-900">관리자 화면</p>
        <p className="py-2 space-x-1">
          <Link to="/admin/profile">
            <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
              프로필 바꾸기
            </span>
          </Link>
          <Link to="/admin/posts">
            <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
              새 글 쓰기
            </span>
          </Link>
          <span className="px-4 py-2 bg-red-800 text-white hover:opacity-75 cursor-pointer transition"
                onClick={() => logout({ returnTo: window.location.origin })}>
            로그아웃
          </span>
        </p>

        <p className="py-8 text-2xl font-bold text-gray-900">내 글 목록</p>
        {this.state.posts.map((post) =>
          (
            <div>
              <p className="py-2 space-x-1">
                <span>{post.title}</span>
                <Link to={`/posts/${post.id}`}>
                  <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
                    보기
                  </span>
                </Link>
                <Link to={`/admin/posts/${post.id}`}>
                  <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
                    고치기
                  </span>
                </Link>
              </p>
            </div>
          )
        )}
      </>
    );
  }
}

export default withAuth0(Index);
