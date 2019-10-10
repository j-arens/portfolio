import { Result, ok, err, match } from '~common/result';
import { HTTPMethod, RouteCallback } from '../type';
import MutableResponse from './MutableResponse';

type RoutesMap = {
  [HTTPMethod.GET]: Record<string, RouteCallback>;
  [HTTPMethod.POST]: Record<string, RouteCallback>;
  [HTTPMethod.PUT]: Record<string, RouteCallback>;
  [HTTPMethod.PATCH]: Record<string, RouteCallback>;
  [HTTPMethod.DELETE]: Record<string, RouteCallback>;
  all: Record<string, RouteCallback>;
};

class Router {
  protected _routes: RoutesMap = {
    [HTTPMethod.GET]: {},
    [HTTPMethod.POST]: {},
    [HTTPMethod.PUT]: {},
    [HTTPMethod.PATCH]: {},
    [HTTPMethod.DELETE]: {},
    all: {},
  };

  public get(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.GET][url] = callback;
  }

  public post(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.POST][url] = callback;
  }

  public put(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.PUT][url] = callback;
  }

  public patch(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.PATCH][url] = callback;
  }

  public delete(url: string, callback: RouteCallback): void {
    this._routes[HTTPMethod.DELETE][url] = callback;
  }

  public all(url: string, callback: RouteCallback): void {
    this._routes.all[url] = callback;
  }

  public dispatch(request: Request): Promise<Response> {
    const { method, url } = request;
    return match<RouteCallback, null, Promise<Response>>({
      result: this._getCallback((method as unknown) as HTTPMethod, url),
      ok: (route: RouteCallback) => this._invokeRoute(route, request),
      err: () =>
        Promise.resolve(
          new Response('not found', { status: 404, statusText: 'not found' }), // @TODO: nice 404 template
        ),
    });
  }

  protected _getCallback(
    method: HTTPMethod,
    url: string,
  ): Result<RouteCallback, null> {
    const { pathname } = new URL(url);
    if (pathname in this._routes[method]) {
      return ok(this._routes[method][pathname]);
    }
    if ('*' in this._routes[method]) {
      return ok(this._routes[method]['*']);
    }
    if (pathname in this._routes.all) {
      return ok(this._routes.all[pathname]);
    }
    if ('*' in this._routes.all) {
      return ok(this._routes.all['*']);
    }
    return err(null);
  }

  protected async _invokeRoute(
    callback: RouteCallback,
    req: Request,
  ): Promise<Response> {
    const result = callback(req, new MutableResponse());
    if (!(result instanceof Promise)) {
      const { body, ...init } = result.properties();
      return new Response(body, init);
    }
    const awaited = await result;
    const { body, ...init } = awaited.properties();
    return new Response(body, init);
  }
}

export default Router;
