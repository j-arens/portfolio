import { FunctionComponent } from 'preact';

export type PostMeta = {
  title: string;
  summary: string;
};

export type RecentPosts = {
  [slug: string]: PostMeta;
};

export type Components = {
  Blog: FunctionComponent;
  About: FunctionComponent;
  Contact: FunctionComponent;
};

type Self = Window & typeof globalThis;

export type GLOBAL = Self & {
  APP: {
    recentPosts: RecentPosts;
    components: Components;
  };
};
