import { h, FunctionComponent } from 'preact';
import '~global-styles/hljs.css';
const s = require('./style.pcss');

type Props = {
  title: string;
  html: string;
};

const Post: FunctionComponent<Props> = ({ title, html }: Props) => (
  <article class={s.article}>
    <h2 class={s.title}>{title}</h2>
    <div class="content" dangerouslySetInnerHTML={{ __html: html }} />
  </article>
);

export default Post;
