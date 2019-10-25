import { h, FunctionComponent } from 'preact';
import { useFetchPost, FetchPostErrors } from '~app/hooks';
import Post from '../Post';
import PageSpinner from '../PageSpinner';
import NotFound from '../NotFound';
import Notify, { NotificationType } from '../Notify';

type Props = {
  slug: string;
};

const PostResolver: FunctionComponent<Props> = ({ slug }: Props) => {
  const [fetching, result] = useFetchPost(slug);
  if (fetching) {
    return <PageSpinner />;
  }
  if (result.isErr()) {
    if (result.err === FetchPostErrors.NOT_FETCHED) {
      return <PageSpinner />;
    }
    if (result.err === FetchPostErrors.NOT_FOUND) {
      return <NotFound />;
    }
    const notification = {
      id: Symbol(),
      dismissable: false,
      type: NotificationType.DANGER,
      message: 'there was an error fetching the post, try refreshing the page',
    };
    return <Notify notifications={[notification]} />;
  }
  const { title, html } = result.ok;
  return <Post title={title} html={html} />;
};

export default PostResolver;
