import { h } from 'preact';
import { Link } from 'preact-router';
const s = require('./style.pcss');

type Props = {
  slug: string;
  title: string;
  excerpt: string;
};

const PostCard = ({ slug, title, excerpt }: Props): h.JSX.Element => {
  return (
    // @ts-ignore - cite attribute
    <blockquote key={slug} className={s.PostCard} cite={`/${slug}`}>
      <Link className={s['PostCard__link']} href={`/${slug}`}>
        <h2>{title}</h2>
        <p>{excerpt}</p>
        <p>Read More &#10097;</p>
      </Link>
    </blockquote>
  );
};

export default PostCard;
