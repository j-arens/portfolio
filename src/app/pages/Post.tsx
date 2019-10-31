import { h, FunctionComponent } from 'preact';
import Match from 'preact-router/match';
import { MatchProps } from '~app/type';
import PageSpinner from '~app/components/PageSpinner';
import { GLOBAL } from '~common/type';
import PostResolver from '../components/PostResolver';

const Post: FunctionComponent<{}> = () => {
  return (
    <main role="main">
      <Match>
        {({ path }: MatchProps): h.JSX.Element => {
          const {
            APP: { ssr },
          } = self as GLOBAL;
          if (ssr) {
            return <PageSpinner />;
          }
          return <PostResolver slug={path} />;
        }}
      </Match>
    </main>
  );
};

export default Post;
