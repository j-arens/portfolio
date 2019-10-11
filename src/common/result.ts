// very minimal variant of the result enum in rust
export interface Result<T, E> {
  isOk: () => boolean;
  isErr: () => boolean;
  ok: T;
  err: E;
}

export function ok<T>(value: T): Result<T, never> {
  return {
    isOk: (): boolean => true,
    isErr: (): boolean => false,
    ok: value,
    err: undefined as never,
  };
}

export function err<E>(err: E): Result<never, E> {
  return {
    isOk: (): boolean => false,
    isErr: (): boolean => true,
    ok: undefined as never,
    err,
  };
}

type MatchParams<T, E, R = void> = {
  result: Result<T, E>;
  ok: (ok: T) => R;
  err: (err: E) => R;
};

export function match<T, E, R = void>({
  result,
  ok,
  err,
}: MatchParams<T, E, R>): R {
  switch (result.isOk() ? 0 : 1) {
    case 0:
      return ok(result.ok);
    case 1:
      return err(result.err);
    default:
      return err(result.err);
  }
}
