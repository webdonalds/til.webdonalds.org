import { Link } from "remix";
import dayjs from "dayjs";
import { OuterLink } from "~/components/molecules/link";

type AuthorProps = {
  id: number;
  name: string;
  profileUrl: string;
  blogUrl?: string;
  githubId?: string;
  twitterId?: string;
  instagramId?: string;
  linkedInId?: string;
  createdAt: Date;
};

export function Author(props: AuthorProps) {
  const { id, name, profileUrl, blogUrl, githubId, twitterId, instagramId, linkedInId, createdAt } = props;
  return (
    <div className="flex my-8 items-center">
      <img className="h-8 w-8 md:h-12 md:w-12 rounded-full mr-3" src={profileUrl} alt={`${name}의 프로필 이미지`} />
      <div>
        <p className="text-gray-900 dark:text-gray-100">
          by&nbsp;
          <Link className="hover:underline hover:opacity-75 transition" to={`/authors/${id}`}>
            <span className="font-bold">{name}</span>
          </Link>
        </p>
        <p className="text-xs space-x-1">
          <span>{dayjs(createdAt).format("YYYY. MM. DD.")}</span>
          {(blogUrl || githubId || twitterId || instagramId || linkedInId) && <span className="md:px-1">|</span>}
          {blogUrl && <OuterLink url={blogUrl}>블로그</OuterLink>}
          {githubId && <OuterLink url={`https://github.com/${githubId}`}>깃허브</OuterLink>}
          {linkedInId && <OuterLink url={`https://www.linkedin.com/in/${linkedInId}`}>링크드인</OuterLink>}
          {twitterId && <OuterLink url={`https://twitter.com/${twitterId}`}>트위터</OuterLink>}
          {instagramId && <OuterLink url={`https://instagram.com/${instagramId}`}>인스타그램</OuterLink>}
        </p>
      </div>
    </div>
  );
}
