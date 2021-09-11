import React from 'react';
import { Link } from 'react-router-dom';
import { withAuth0 } from '@auth0/auth0-react';
import { RouteWithAuth0Component, RouteWithAuth0Props } from '../../component/RouteWithAuth0Props';

class Index extends RouteWithAuth0Component<RouteWithAuth0Props, any> {
  render() {
    const { logout } = this.props.auth0;
    return (
      <div>
        <p className="py-4 text-4xl font-bold text-gray-900">관리 페이지</p>
        <p className="py-2 space-x-1">
          <Link to="/admin/profile">
            <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
              프로필 편집
            </span>
          </Link>
        </p>
        <p className="py-2">
          <span className="px-4 py-2 bg-red-800 text-white hover:opacity-75 cursor-pointer transition"
                onClick={() => logout({ returnTo: window.location.origin })}>
            로그아웃
          </span>
        </p>
      </div>
    );
  }
}

export default withAuth0(Index);
