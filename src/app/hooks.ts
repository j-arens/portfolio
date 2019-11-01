import { useState, useEffect } from 'preact/hooks';
import { Notification } from './components/Notify';
import { Result, ok, err } from '~common/result';
import { GLOBAL, Post } from '~common/type';

export enum FetchPostErrors {
  'NOT_FETCHED',
  'NOT_FOUND',
  'REQ_FAILED',
}

export function useFetchPost(
  slug: string,
): [boolean, Result<Post, FetchPostErrors>] {
  const {
    APP: { posts, storageUrl },
  } = self as GLOBAL;
  const [fetching, setFetching] = useState<boolean>(false);
  const [result, setResult] = useState<Result<Post, FetchPostErrors>>(
    err(FetchPostErrors.NOT_FETCHED),
  );
  useEffect(() => {
    // @TODO: move fetching into a web worker at some point
    if (posts.has(slug)) {
      setResult(ok(posts.get(slug) as Post));
      return;
    }
    setFetching(true);
    fetch(`${storageUrl}/posts/${slug.replace(/^\//, '')}.json`)
      .then(async res => {
        if (!res.ok) {
          if (res.status === 404) {
            setResult(err(FetchPostErrors.NOT_FOUND));
            return;
          }
          console.error(res.statusText);
          setResult(err(FetchPostErrors.REQ_FAILED));
          return;
        }
        const post: Post = await res.json();
        posts.set(slug, post);
        setResult(ok(post));
      })
      .catch(e => {
        console.error(e);
        setResult(err(FetchPostErrors.REQ_FAILED));
      })
      .finally(() => setFetching(false));
  }, [slug]);
  return [fetching, result];
}

type NewNotification = Omit<Notification, 'id'>;
type NotificationsState = Map<symbol, Notification>;

export function useNotifications(
  initialState: NotificationsState = new Map(),
): [NotificationsState, (n: NewNotification) => void, (id: symbol) => void] {
  const [state, setState] = useState(initialState);
  const add = (notification: NewNotification): void => {
    const id = Symbol();
    const newState = new Map(state);
    newState.set(id, {
      ...notification,
      id,
    });
    setState(newState);
  };
  const remove = (id: symbol): void => {
    const newState = new Map(state);
    newState.delete(id);
    setState(newState);
  };
  return [state, add, remove];
}

export function useDelay(delay = 1000): boolean {
  const [delayed, setDelayed] = useState<boolean>(false);
  useEffect(() => {
    if (delayed) {
      return;
    }
    setTimeout(() => {
      setDelayed(true);
    }, delay);
  }, []);
  return delayed;
}
