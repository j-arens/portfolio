import MutableResponse from './http/MutableResponse';

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
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'PATCH' = 'PATCH',
  'DELETE' = 'DELETE',
}

export type RouteCallback = (
  req: Request,
  res: MutableResponse,
) => MutableResponse | Promise<MutableResponse>;
