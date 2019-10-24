import { h, FunctionComponent } from 'preact';
import Match from 'preact-router/match';
import PostResolver from '../components/PostResolver';
import RecentPosts from '../components/RecentPosts';
import { MatchProps } from '~app/type';

const Blog: FunctionComponent<{}> = () => (
  <main role="main">
    <Match>
      {({ path }: MatchProps): h.JSX.Element => {
        const match = path.match(/\/blog\/(.+)/);
        if (Array.isArray(match) && match[1]) {
          return <PostResolver slug={match[1]} />;
        }
        return <RecentPosts />;
      }}
    </Match>
  </main>
);

export default Blog;
