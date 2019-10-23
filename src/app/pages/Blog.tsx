import { h, FunctionComponent } from 'preact';
import Match from 'preact-router/match';
import RecentPosts from '../components/RecentPosts';
import Post from '../components/Post';
import NotFound from '../components/NotFound';
import { MatchProps } from '~app/type';

const Blog: FunctionComponent<{}> = () => (
  <main role="main">
    <Match>
      {({ path }: MatchProps): h.JSX.Element => {
        if (path === '/' || path === '/blog') {
          return <RecentPosts />;
        }
        const slug = path.replace('/blog/', '');
        if (slug) {
          return <Post id={slug} />;
        }
        return <NotFound />;
      }}
    </Match>
  </main>
);

export default Blog;
