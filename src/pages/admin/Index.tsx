import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

function Index() {
  const { user, logout } = useAuth0();
  return (
    <div>
      <p>현재 로그인 정보 : {user?.nickname}</p>
      <button onClick={() => logout({ returnTo: window.location.origin })}>로그아웃</button>
    </div>
  );
}

export default Index;
