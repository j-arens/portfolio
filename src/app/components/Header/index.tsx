import { h, FunctionComponent } from 'preact';
import { Link } from 'preact-router';
import SiteNav from '../SiteNav';
const s = require('./style.pcss');

const Header: FunctionComponent<{}> = () => {
  return (
    <header class={s.Header}>
      <h1 class={s.HeaderTitle}>
        <Link href="/">Josh Arens</Link>
      </h1>
      <SiteNav />
    </header>
  );
};

export default Header;
