import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { withAuth0 } from '@auth0/auth0-react';
import { RouteWithAuth0Component, RouteWithAuth0Props } from '../../component/RouteWithAuth0Props';
import { UserResponse } from '../../lib/server';
import { query } from '../../lib/server/query';

interface ModifyProfileState {
  me: UserResponse | null;
  saving: boolean;
}

class ModifyProfile extends RouteWithAuth0Component<RouteWithAuth0Props, ModifyProfileState> {
  constructor(props: RouteWithAuth0Props) {
    super(props);
    this.state = { me: null, saving: false };
  }

  async getMe(): Promise<UserResponse | null> {
    const data = await query<{ til_users: UserResponse[] }>(`
      query {
        til_users(where: { auth_id: { _eq: "{{ user.auth_id }}" } }) {
          display_name
          profile_image
        }
      }
    `, await this.generateToken());
    return data.data.til_users?.length === 1 ? data.data.til_users[0] : null;
  }

  componentDidMount() {
    this.getMe().then((user) => { this.setState({ me: user }); });
  }

  handleDisplayNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { me } = this.state;
    this.setState({ me: { ...me!, display_name: e.target.value } });
  }

  handleProfileImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { me } = this.state;
    this.setState({ me: { ...me!, profile_image: e.target.value } });
  }

  handleUpdateMe = async () => {
    this.setState({ saving: true });
    const { display_name, profile_image } = this.state.me!;
    await query<{}>(`
      mutation {
        update_til_users(
          where: { auth_id: { _eq: "{{ user.auth_id }}" } },
          _set: {
            display_name: "${display_name}"
            profile_image: "${profile_image}"
          },
        ) {
          returning {
            auth_id
          }
        }
      }
    `, await this.generateToken());

    this.props.history.push('/admin');
  }

  render() {
    const { me, saving } = this.state;
    return (
      <div>
        <p className="py-4 text-4xl font-bold text-gray-900">프로필 편집</p>
        {me ? (
            <div>
              <form>
                <label className="block py-2">
                  <span className="my-2">닉네임</span>
                  <input className="block rounded" type="text" value={me.display_name}
                         onChange={this.handleDisplayNameChange} />
                </label>
                <label className="block py-2">
                  <span className="my-2">프로필 이미지</span>
                  <input className="block rounded w-full" type="text" value={me.profile_image}
                         onChange={this.handleProfileImageChange} />
                </label>
                {me.profile_image ? (
                    <div className="py-2">
                      <span className="my-2">프로필 이미지 미리보기</span>
                      <img className="h-20 w-20 rounded-full" src={me.profile_image}
                           alt="프로필 이미지를 불러올 수 없어요." />
                    </div>
                  ) : null
                }

                <div className="my-8 space-x-1">
                  <span className={`px-4 py-2 bg-blue-600 text-white ${saving ? 'opacity-50' : 'hover:opacity-75'} cursor-pointer transition`}
                        onClick={this.handleUpdateMe}>
                    {saving ? '저장중...' : '저장'}
                  </span>
                  <Link to="/admin">
                    <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
                      취소
                    </span>
                  </Link>
                </div>
              </form>
            </div>
          ) : (<Skeleton count={3}/>)
        }
      </div>
    );
  }
}

export default withAuth0(ModifyProfile);
