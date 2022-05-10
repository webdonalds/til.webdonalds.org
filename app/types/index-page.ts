export type IndexData = {
  til_posts: {
    id: number;
    title: string;
    tags: {
      tag: {
        name: string;
        slug: string;
      };
    }[];
    author: {
      id: number;
      display_name: string;
      profile_image: string;
    };
    created_at: string;
  }[];
};

export type IndexProps = {
  posts: {
    id: number;
    title: string;
    tags: {
      name: string;
      slug: string;
    }[];
    author: {
      id: number;
      displayName: string;
      profileImage: string;
    };
    createdAt: Date;
  }[];
  pageInfo: {
    page: number;
    hasBefore: boolean;
    hasNext: boolean;
  };
};
