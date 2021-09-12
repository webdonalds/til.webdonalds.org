import React, { ChangeEvent } from 'react';
import Skeleton from 'react-loading-skeleton';
import { withAuth0 } from '@auth0/auth0-react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { RouteWithAuth0Component, RouteWithAuth0Props } from '../../component/RouteWithAuth0Props';
import { PostResponse, UserResponse } from '../../lib/server';
import { query } from '../../lib/server/query';
import { Link } from 'react-router-dom';

interface ModifyPostState {
  me: UserResponse | null;
  postId: number | null;
  postForm: {
    title?: string;
    content?: string;
  }
  saving: boolean;
}

async function queryPost(postId: number): Promise<PostResponse> {
  const data = await query<{ til_posts: PostResponse[] }>(`
    query {
      til_posts(where: { id: { _eq: ${postId} } }) {
        title
        content
      }
    }
  `);
  return data.data.til_posts[0];
}

class ModifyPost extends RouteWithAuth0Component<RouteWithAuth0Props, ModifyPostState> {
  private editorRef = React.createRef<Editor>();

  constructor(props: RouteWithAuth0Props) {
    super(props);

    const { id } = this.props.match.params as { id?: string };
    this.state = {
      me: null,
      postId: id ? parseInt(id) : null,
      postForm: {},
      saving: false,
    };
  }

  async componentDidMount() {
    const me = await this.getMe();
    const postForm = this.state.postId ? (await queryPost(this.state.postId)) : {};

    this.setState({ me, postForm });
  }

  handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { postForm } = this.state;
    this.setState({ postForm: { ...postForm, title: e.target.value } });
  }

  handleContentChange = () => {
    const { postForm } = this.state;
    const content = this.editorRef.current!.getInstance().getMarkdown();
    this.setState({ postForm: { ...postForm, content } });
  }

  handleCreate = async () => {
    await query<{}>(`
      mutation {
        insert_til_posts(objects: [{
          title: "${this.state.postForm.title}"
          content: ${JSON.stringify(this.state.postForm.content)}
          author_id: ${this.state.me!.id}
        }]) {
          returning {
            id
          }
        }
      }
    `, await this.generateToken());
    this.props.history.push('/admin');
  }

  handleUpdate = async () => {
    await query<{}>(`
      mutation {
        update_til_posts(
          where: { id: { _eq: ${this.state.postId} } },
          _set: {
            title: "${this.state.postForm.title}"
            content: ${JSON.stringify(this.state.postForm.content)}
          },
        ) {
          returning {
            id
          }
        }
      }
    `, await this.generateToken());
    this.props.history.push('/admin');
  }

  render() {
    const { me, postForm, postId, saving } = this.state;
    return (
      <>
        <p className="py-4 text-4xl font-bold text-gray-900">
          {postId ? '글 고치기' : '새 글 쓰기'}
        </p>
        {me ? (
            <div>
              <label className="block py-2">
                <span className="my-2">제목</span>
                <input className="block rounded w-full" type="text" value={postForm.title}
                       onChange={this.handleTitleChange} />
              </label>
              <div className="py-2">
                <span className="my-2">내용 (마크다운)</span>
                <div className = "bg-white">
                  <Editor height="600px" ref={this.editorRef}
                          initialValue={postForm.content}
                          onChange={this.handleContentChange} />
                </div>
              </div>

              <div className="my-8 space-x-1">
                <span className={`px-4 py-2 bg-blue-600 text-white ${saving ? 'opacity-50' : 'hover:opacity-75'} cursor-pointer transition`}
                      onClick={postId ? this.handleUpdate : this.handleCreate}>
                  {saving ? '저장중...' : '저장'}
                </span>
                <Link to="/admin">
                  <span className="px-4 py-2 bg-gray-300 hover:opacity-75 cursor-pointer transition">
                    취소
                  </span>
                </Link>
              </div>
            </div>
          ) : (<Skeleton count={3} />)
        }
      </>
    );
  }
}

export default withAuth0(ModifyPost);
