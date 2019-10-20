import { h, FunctionComponent, Fragment } from 'preact';
import { GLOBAL, PostMeta } from '~common/type';
import Excerpt from '../Excerpt';

const RecentPosts: FunctionComponent<{}> = () => {
  const {
    APP: { recentPosts },
  } = self as GLOBAL;
  return (
    <Fragment>
      {Object.entries(recentPosts).map(([slug, meta]: [string, PostMeta]) => (
        <Excerpt
          key={slug}
          slug={slug}
          title={meta.title}
          summary={meta.summary}
        />
      ))}
    </Fragment>
  );
};

export default RecentPosts;
