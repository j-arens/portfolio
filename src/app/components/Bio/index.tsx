import { h } from 'preact';
const s = require('./style.pcss');

const Bio = (): h.JSX.Element => {
  return (
    <section class={s.container}>
      <figure class={s.headshot}>
        <img
          class={s.headshotImg}
          src="https://images.unsplash.com/photo-1567209053779-784e66275c73?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1834&q=80"
          alt="some doofus"
        />
      </figure>
      <article class={s.cv}>
        <h2 class={s.cvTitle}>Lorem Ipsum</h2>
        <p class={s.cvText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia ad
          mollitia architecto tenetur delectus dolor facilis, minus earum error
          debitis, sunt eos magni, aliquid a commodi magnam! Magni, accusantium
          delectus.
        </p>
        <p class={s.cvText}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas atque
          iure rem commodi quo, minima cupiditate ullam autem maiores? Dolorem
          aperiam id, qui animi impedit atque officia ipsam mollitia laudantium!
        </p>
      </article>
    </section>
  );
};

export default Bio;
