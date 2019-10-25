import { h, FunctionComponent } from 'preact';
import Match from 'preact-router/match';
import { MatchProps } from '~app/type';
import PageSpinner from '~app/components/PageSpinner';
import { GLOBAL } from '~common/type';
import PostResolver from '../components/PostResolver';
import RecentPosts from '../components/RecentPosts';

const Blog: FunctionComponent<{}> = () => (
  <main role="main">
    <Match>
      {({ path }: MatchProps): h.JSX.Element => {
        const match = path.match(/\/blog\/(.+)/);
        if (Array.isArray(match) && match[1]) {
          const {
            APP: { ssr },
          } = self as GLOBAL;
          if (ssr) {
            return <PageSpinner />;
          }
          return <PostResolver slug={match[1]} />;
        }
        return <RecentPosts />;
      }}
    </Match>
  </main>
);

export default Blog;
