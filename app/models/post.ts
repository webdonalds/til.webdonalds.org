import { Author } from "./author";

export type Post = {
  title: string;
  content: string;
  createdAt?: Date;
  author?: Author;
};
