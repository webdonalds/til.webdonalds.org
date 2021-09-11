import React, { ComponentType } from 'react';
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

interface PrivateRouteProps extends RouteProps {
  component: ComponentType<RouteComponentProps>;
}

const PrivateRoute = ({ component, path, ...args } : PrivateRouteProps) => (
  <Route component={withAuthenticationRequired(component, {
    returnTo: path as string,
    onRedirecting: () => (
      <div className="flex justify-center items-center">
        <div className="text-center">
          <p className="m-8 text-8xl">🔍</p>
          <p className="m-4 font-bold text-2xl">로그인 정보 확인중...</p>
        </div>
      </div>
    ),
  })} {...args} />
);

export default PrivateRoute;
