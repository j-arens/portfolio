export interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): any;
}

export type RecentPosts = {
  [k: string]: {
    title: string;
    excerpt: string;
  };
};
