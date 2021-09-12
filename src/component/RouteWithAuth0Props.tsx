import { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { WithAuth0Props } from '@auth0/auth0-react';
import { v4 as uuidv4 } from 'uuid';
import { UserResponse } from '../lib/server';
import { query } from '../lib/server/query';

export interface RouteWithAuth0Props extends WithAuth0Props, RouteComponentProps {}

export class RouteWithAuth0Component<P extends RouteWithAuth0Props, S> extends Component<P, S> {
  async generateToken(): Promise<string> {
    const { getAccessTokenSilently } = this.props.auth0;
    return getAccessTokenSilently({
      audience: 'https://webdonalds.jp.auth0.com/api/v2/',
      scope: 'read:current_user',
    });
  }

  async getMe(): Promise<UserResponse | null> {
    const data = await query<{ webdonalds_users: UserResponse[] }>(`
      query {
        webdonalds_users(where: { auth_id: { _eq: "{{ user.auth_id }}" } }) {
          display_name
          profile_image
        }
      }
    `, await this.generateToken());

    if (data.data.webdonalds_users?.length === 1) {
      return data.data.webdonalds_users[0];
    }

    await query<{}>(`
      mutation {
        insert_webdonalds_users(objects: [{
          uuid: "${uuidv4()}",
          auth_id: "{{ user.auth_id }}",
          display_name: "${this.props.auth0.user!.email!.split('@')[0]}",
        }]) {
          returning {
            display_name
            profile_image
          }
        }
      }
    `, await this.generateToken());
    return this.getMe();
  }
}
