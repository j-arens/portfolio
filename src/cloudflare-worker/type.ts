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

export enum HTTPMethod {
  'get',
  'post',
  'put',
  'patch',
  'delete',
}

export type MutableResponse = {
  body: '';
  status: 200;
  statusText: '';
  headers: Headers;
};

export type RouteCallback = (
  req: Request,
  res: MutableResponse,
) => MutableResponse;
