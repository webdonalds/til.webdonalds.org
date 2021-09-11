import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import qs from 'query-string';

function SignIn(props: RouteComponentProps) {
  const query = qs.parse(props.location.search);
  if (query.error === 'unauthorized') {
    const message = (query.error_description === 'email_not_verified') ?
      ['✉️', '인증 메일을 전송했어요. 메일함을 확인해주세요.'] :
      ['✋', '이 서비스는 허용된 사용자만 이용할 수 있어요.'];
    return (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <p className="m-8 text-8xl">{message[0]}</p>
          <p className="m-4 font-bold text-2xl">{message[1]}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default SignIn;
