export interface UserResponse {
  id: number;
  display_name: string;
  profile_image?: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  tags: PostTagRelation[];
  author: UserResponse;
  created_at: string;
  updated_at: string;
}

export interface PostTagResponse {
  name: string;
  slug: string;
}

export interface PostTagRelation {
  post: PostResponse;
  tag: PostTagResponse;
}
