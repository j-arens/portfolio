import { useState, useEffect } from 'preact/hooks';
import { Post } from './type';

const { fetch } = self;

export function fetchPost(id: string): Post | null {
  const {
    // @ts-ignore
    APP: {
      posts,
      storage: { url },
    },
  } = self;
  const [post, setPost] = useState<Post | null>(null);
  useEffect(() => {
    if (id in posts) {
      setPost(posts[id]);
    } else {
      // do fetching in web worker??
      fetch(`${url}/${id}.json`)
        .then(async res => {
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
          }
          const json = await res.json();
          posts[id] = json;
          setPost(json);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [id]);
  return post;
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
