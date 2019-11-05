import { FunctionComponent } from 'preact';

export type Post = {
  title: string;
  slug: string;
  date: string;
  summary: string;
  html: string;
};

export type PostMeta = Pick<Post, 'title' | 'summary'>;

export type RecentPosts = {
  [slug: string]: PostMeta;
};

export type Components = {
  Blog: FunctionComponent;
  About: FunctionComponent;
  Contact: FunctionComponent;
  Post: FunctionComponent;
};

type Self = Window & typeof globalThis;

export type GLOBAL = Self & {
  APP: {
    recentPosts: RecentPosts;
    posts: Map<string, Post>;
    components: Components;
    storageUrl: string;
    ssr: boolean;
    version: string;
  };
};
