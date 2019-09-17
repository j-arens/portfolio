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
    <blockquote key={slug} class={s.PostCard} cite={`/${slug}`}>
      <Link class={s.link} href={`/blog/${slug}`}>
        <h2 class={s.title}>{title}</h2>
        <p class={s.excerpt}>{excerpt}</p>
        <p class={s.readMore}>
          Read More
          <svg
            class={s.chevron}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </p>
      </Link>
    </blockquote>
  );
};

export default PostCard;
