import { Result, ok, err, match } from '~common/result';
import { HTTPMethod, RouteCallback } from './type';

type RoutesMap = {
  [HTTPMethod.get]: Record<string, RouteCallback>;
  [HTTPMethod.post]: Record<string, RouteCallback>;
  [HTTPMethod.put]: Record<string, RouteCallback>;
  [HTTPMethod.patch]: Record<string, RouteCallback>;
  [HTTPMethod.delete]: Record<string, RouteCallback>;
  all: Record<string, RouteCallback>;
};

class Router {
  protected _routes: RoutesMap = {
    [HTTPMethod.get]: {},
    [HTTPMethod.post]: {},
    [HTTPMethod.put]: {},
    [HTTPMethod.patch]: {},
    [HTTPMethod.delete]: {},
    all: {},
  };

  public get(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.get][url] = callback;
  }

  public post(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.post][url] = callback;
  }

  public put(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.put][url] = callback;
  }

  public patch(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.patch][url] = callback;
  }

  public delete(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.delete][url] = callback;
  }

  public all(url: string, callback: RouteCallback): void {
    this._routes.all[url] = callback;
  }

  public dispatch(request: Request): Response {
    const { method, url } = request;
    return match<RouteCallback, null, Response>({
      result: this._getCallback((method as unknown) as HTTPMethod, url),
      ok: (route: RouteCallback) => this._invokeRoute(route, request),
      err: () => new Response('', { status: 404, statusText: 'not found' }), // @TODO: nice 404 template
    });
  }

  protected _getCallback(
    method: HTTPMethod,
    url: string,
  ): Result<RouteCallback, null> {
    if (url in this._routes[method]) {
      return ok(this._routes[method][url]);
    }
    if (url in this._routes.all) {
      return ok(this._routes.all[url]);
    }
    if ('*' in this._routes.all) {
      return ok(this._routes.all['*']);
    }
    return err(null);
  }

  protected _invokeRoute(route: RouteCallback, req: Request): Response {
    const { body, ...init } = route(req, {
      body: '',
      status: 200,
      statusText: '',
      headers: new Headers(),
    });
    return new Response(body, init);
  }
}

export default Router;
