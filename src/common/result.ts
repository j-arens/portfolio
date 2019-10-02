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

type MatchParams<T, E> = {
  result: Result<T, E>;
  ok: (ok: T) => void;
  err: (err: E) => void;
};

export function match<T, E>({ result, ok, err }: MatchParams<T, E>): void {
  switch (result.isOk() ? 0 : 1) {
    case 0:
      ok(result.ok);
      break;
    case 1:
      err(result.err);
      break;
    default:
      err(result.err);
  }
}
