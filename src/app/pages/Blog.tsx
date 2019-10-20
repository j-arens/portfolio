import { h, FunctionComponent } from 'preact';
import Match from 'preact-router/match';
import RecentPosts from '../components/RecentPosts';
import Post from '../components/Post';
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
        // @TODO: 404
        return <div>lol 404</div>;
      }}
    </Match>
  </main>
);

export default Blog;
