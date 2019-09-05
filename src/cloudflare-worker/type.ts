export interface FetchEvent extends Event {
  request: Request;
  respondWith(response: Promise<Response> | Response): any;
}

export type Manifest = { [k: string]: string };
