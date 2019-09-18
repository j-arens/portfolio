import { h } from 'preact';
import { fetchPost } from '~app/hooks';
const s = require('./style.pcss');

type Props = {
  id: string;
};

const Post = ({ id }: Props): h.JSX.Element => {
  const post = fetchPost(id);
  if (!post) {
    return <div>no post...</div>;
  }
  return (
    <article class={s.article}>
      <h2 class={s.title}>{post.title}</h2>
      <div class="content" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
};

export default Post;

// store state in APP namespace on the window
// store article fetcher on APP?
