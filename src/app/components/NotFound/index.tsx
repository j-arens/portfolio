import { h, FunctionComponent } from 'preact';
const s = require('./style.pcss');

const NotFound: FunctionComponent<{}> = () => (
  <div class={s.notFound}>
    <p class={s.title}>404</p>
    <p class={s.text}>Couldn&apos;t find what you&apos;re looking for</p>
  </div>
);

export default NotFound;
