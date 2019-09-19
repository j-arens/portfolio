import { h } from 'preact';
import Match from 'preact-router/match';
import PostCard from '../components/PostCard';
import Post from '../components/Post';

import { MatchProps } from '~app/type';

type PostMeta = {
  title: string;
  excerpt: string;
};

const Blog = (): h.JSX.Element => {
  const {
    APP: { recentPosts },
  } = self;
  return (
    <main role="main">
      <Match>
        {({ path }: MatchProps): h.JSX.Element => {
          if (path === '/' || path === '/blog') {
            return Object.entries(recentPosts).map(
              ([slug, meta]: [string, PostMeta]) => (
                <PostCard
                  slug={slug}
                  title={meta.title}
                  excerpt={meta.excerpt}
                />
              ),
            );
          }
          const slug = path.replace('/blog/', '');
          return <Post id={slug} />;
        }}
      </Match>
    </main>
  );
};

export default Blog;
