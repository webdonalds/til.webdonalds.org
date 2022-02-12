import dayjs from "dayjs";

type AuthorProps = {
  name: string;
  profileUrl: string;
  blogUrl?: string;
  githubId?: string;
  twitterId?: string;
  instagramId?: string;
  createdAt: Date;
};

function AuthorLink({ url, children }: { url: string, children: string }) {
  return (
    <a className="hover:opacity-75 hover:underline transition" href={url} target="_blank">
      {children}
    </a>
  );
}

export function Author(props: AuthorProps) {
  const { name, profileUrl, blogUrl, githubId, twitterId, instagramId, createdAt } = props;
  return (
    <div className="flex my-8 items-center">
      <img className="h-8 w-8 md:h-12 md:w-12 rounded-full mr-3" src={profileUrl} alt={`${name}의 프로필 이미지`} />
      <div>
        <p className="text-gray-900 dark:text-gray-100">by <span className="font-bold">{name}</span></p>
        <p className="text-xs space-x-1">
          <span>{dayjs(createdAt).format("YYYY. MM. DD.")}</span>
          {(blogUrl || githubId || twitterId || instagramId) &&
            <span className="md:px-1">|</span>}
          {blogUrl && <AuthorLink url={blogUrl}>블로그</AuthorLink>}
          {githubId && <AuthorLink url={`https://github.com/${githubId}`}>깃허브</AuthorLink>}
          {twitterId && <AuthorLink url={`https://twitter.com/${twitterId}`}>트위터</AuthorLink>}
          {instagramId && <AuthorLink url={`https://instagram.com/${instagramId}`}>인스타그램</AuthorLink>}
        </p>
      </div>
    </div>
  );
}
