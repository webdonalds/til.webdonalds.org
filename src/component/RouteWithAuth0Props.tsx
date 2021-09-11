import { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { WithAuth0Props } from '@auth0/auth0-react';

export interface RouteWithAuth0Props extends WithAuth0Props, RouteComponentProps {}

export class RouteWithAuth0Component<P extends RouteWithAuth0Props, S> extends Component<P, S> {
  async generateToken(): Promise<string> {
    const { getAccessTokenSilently } = this.props.auth0;
    return getAccessTokenSilently({
      audience: 'https://webdonalds.jp.auth0.com/api/v2/',
      scope: 'read:current_user',
    });
  }
}
