export type Author = {
  id: number;
  name: string;
  profileImageUrl: string;
  social: AuthorSocialProfile;
};

type AuthorSocialProfile = {
  blogUrl: string | null;
  githubId: string | null;
  twitterId: string | null;
  instagramId: string | null;
  linkedInId: string | null;
};
