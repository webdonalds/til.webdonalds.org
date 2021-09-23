import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { PostResponse } from '../lib/server';
import { joinWheres, query } from '../lib/server/query';

interface PostListFilter {
  tag?: string | null;
  author?: string | null;
}

interface PostListState {
  filter: PostListFilter;
  posts: PostResponse[];
  loaded: boolean;
}

async function queryPosts(filter: PostListFilter): Promise<PostResponse[]> {
  const where = joinWheres([
    filter.tag ? `{ tags: { tag: { slug: { _eq: "${filter.tag}" } } } }` : null,
    filter.author ? `{ author: { display_name: { _eq: "${filter.author}" } } }` : null,
  ].filter((it) => it) as string[]);

  const data = await query<{ til_posts: PostResponse[] }>(`
    query @cached {
      til_posts(limit: 10, order_by: { id: desc }, where: ${where}) {
        id
        title
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
    }
  `);
  return data.data.til_posts;
}

class Index extends Component<RouteComponentProps, PostListState> {
  constructor(props: RouteComponentProps) {
    super(props);
    const params = new URLSearchParams(props.location.search);
    this.state = {
      filter: {
        tag: params.get('tag'),
        author: params.get('author'),
      },
      posts: [],
      loaded: false,
    };
  }

  async componentDidMount() {
    this.setState({
      posts: await queryPosts(this.state.filter),
      loaded: true,
    });
  }

  applyFilter = (filter: PostListFilter) => {
    const query = [
      filter.tag ? `tag=${filter.tag}` : null,
      filter.author ? `author=${filter.author}` : null,
    ].filter((it) => it).join('&');
    this.props.history.push(`?${query}`);

    this.setState({ filter, loaded: false });
    queryPosts(filter).then((posts) => {
      this.setState({ posts, loaded: true });
    });
  }

  render() {
    const { loaded, posts, filter } = this.state;
    if (loaded && (!posts || posts.length === 0)) {
      return (
        <div className="text-center">
          <p className="m-8 text-8xl">🤔</p>
          <p className="m-4 font-bold text-2xl">해당하는 조건의 글이 없어요.</p>
        </div>
      );
    }

    const filterString = [
      filter.tag ? `tag: ${filter.tag}` : null,
      filter.author ? `author: ${filter.author}` : null,
    ].filter((it) => it).join(', ');

    return (
      <div>
        <p className="py-4">
          <span className="text-4xl font-bold text-gray-900">최신 글</span>
          <span className="text-2xl">{filterString ? ` (${filterString})` : null}</span>
        </p>
        {loaded ? (
          <div className="my-8">
            {posts.map((post) => (
              <div className="mb-12" key={`post-${post.id}`}>
                <p className="text-sm space-x-2">
                  {post.tags.map(tag => (
                    <span className="hover:underline cursor-pointer"
                          onClick={() => this.applyFilter({ tag: tag.tag.slug })}>
                      #{tag.tag.name}
                    </span>
                  ))}
                </p>
                <Link to={`/posts/${post.id}`}>
                  <p className="my-2 text-2xl font-bold hover:text-gray-900 hover:underline transition">
                    {post.title}
                  </p>
                </Link>
                <div className="flex items-center text-sm hover:underline cursor-pointer"
                     onClick={() => this.applyFilter({ author: post.author.display_name })}>
                  <img className="h-4 w-4 rounded-full mr-1"
                       src={post.author.profile_image || '/blank-profile.webp'}
                       alt={`${post.author.display_name}의 프로필 이미지`}/>
                  <span>{post.author.display_name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <Skeleton count={3} />
          </div>
        )
        }
      </div>
    );
  }
}

export default Index;
