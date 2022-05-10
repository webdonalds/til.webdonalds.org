import type { LoaderFunction } from "remix";
import { useLoaderData, json, useSearchParams } from "remix";
import { gql } from "@urql/core";
import { PageButtons } from "~/components/molecules/paging";
import { Header } from "~/components/organisms/header";
import { PostListItem } from "~/components/organisms/postlist";
import { client } from "~/lib/api/client.server";
import { IndexData, IndexProps } from "~/types/index-page";
import { ErrorMessage } from "~/components/templates/error";

const query = gql<IndexData>`
  query($offset: Int) @cached {
    til_posts(limit: 11, offset: $offset, order_by: { id: desc }) {
      id
      title
      tags {
        tag {
          name
          slug
        }
      }
      author {
        id
        display_name
        profile_image
      }
      created_at
    }
  }
`;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page")) || 1;
  const { data, error }: { data: IndexData }
    = await client.query<IndexData>(query, { offset: (page - 1) * 10 }).toPromise();
  if (error || !data.til_posts || data.til_posts.length === 0) {
    throw json(null, { status: 400 });
  }

  return json<IndexProps>({
    posts: data.til_posts.map((p) => ({
      id: p.id,
      title: p.title,
      tags: p.tags.map((t) => t.tag),
      author: {
        id: p.author.id,
        displayName: p.author.display_name,
        profileImage: p.author.profile_image,
      },
      createdAt: new Date(p.created_at),
    })),
    pageInfo: {
      page,
      hasBefore: page > 1,
      hasNext: data.til_posts.length > 10,
    },
  });
};

export function CatchBoundary() {
  return (
    <>
      <Header />
      <ErrorMessage emoji="❓" message="잘못된 요청이에요." />
    </>
  );
}

export default function Index() {
  const [_, setSearchParams] = useSearchParams();
  const { posts, pageInfo } = useLoaderData<IndexProps>();
  return (
    <>
      <Header />
      <>
        {posts.map((post) => (
          <PostListItem
            key={`post-${post.id}`}
            post={{
              id: post.id,
              title: post.title,
              author: {
                id: post.author.id,
                name: post.author.displayName,
                profileUrl: post.author.profileImage,
              },
              tags: post.tags,
              createdAt: post.createdAt,
            }}
          />
        ))}
      </>
      <div className="pb-32">
        <PageButtons
          hasBefore={pageInfo.hasBefore}
          hasNext={pageInfo.hasNext}
          currentPage={pageInfo.page}
          setPage={(page) => {
            setSearchParams({ page: page.toString() });
          }}
        />
      </div>
    </>
  );
}
