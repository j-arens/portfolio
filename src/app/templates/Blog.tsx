import { h } from 'preact';
import PostCard from '../components/PostCard';

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
      {Object.entries(recentPosts).map(([slug, meta]: [string, PostMeta]) => (
        <PostCard slug={slug} title={meta.title} excerpt={meta.excerpt} />
      ))}
    </main>
  );
};

export default Blog;
