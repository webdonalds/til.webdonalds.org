import { Link } from "remix";
import { OuterLink } from "~/components/molecules/link";
import { Author } from "~/models";

type AuthorProps = {
  data: Author;
};

export function Author({ data: author }: AuthorProps) {
  const { id, name, profileImageUrl, social } = author;

  const { blogUrl, githubId, twitterId, instagramId, linkedInId } = social;
  const socialExists = !!(blogUrl || githubId || twitterId || instagramId || linkedInId);

  return (
    <div className="flex my-8 items-center">
      <img className="h-12 w-12 rounded-full mr-3" src={profileImageUrl} alt={`${name}의 프로필 이미지`} />
      <div>
        <p className="text-xl text-gray-900 dark:text-gray-100">
          by&nbsp;
          <Link className="hover:underline hover:opacity-75 transition" to={`/authors/${id}`}>
            <span className="font-bold">{name}</span>
          </Link>
        </p>
        {socialExists &&
          <p className="text-xs space-x-1">
            {blogUrl && <OuterLink url={blogUrl}>블로그</OuterLink>}
            {githubId && <OuterLink url={`https://github.com/${githubId}`}>깃허브</OuterLink>}
            {linkedInId && <OuterLink url={`https://www.linkedin.com/in/${linkedInId}`}>링크드인</OuterLink>}
            {twitterId && <OuterLink url={`https://twitter.com/${twitterId}`}>트위터</OuterLink>}
            {instagramId && <OuterLink url={`https://instagram.com/${instagramId}`}>인스타그램</OuterLink>}
          </p>
        }
      </div>
    </div>
  );
}
