import { h } from 'preact';
import { Link } from 'preact-router';
import Match from 'preact-router/match';
const s = require('./style.pcss');

type MatchProps = {
  url: string;
  path: string;
  matches: boolean;
};

const SiteNav = (): h.JSX.Element => {
  const links = {
    '/': 'Blog',
    '/about': 'About',
    '/contact': 'Contact',
  };
  return (
    <Match>
      {({ path }: MatchProps): h.JSX.Element => (
        <nav>
          {Object.entries(links).map(([link, name]) => (
            <Link
              key={link}
              href={link}
              class={[
                s.NavLink,
                link === path ? s['NavLink--current'] : '',
              ].join(' ')}
            >
              {name}
            </Link>
          ))}
        </nav>
      )}
    </Match>
  );
};

export default SiteNav;
