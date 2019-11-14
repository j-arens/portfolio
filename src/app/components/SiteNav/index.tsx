import { h, FunctionComponent } from 'preact';
import { Link } from 'preact-router';
import Match from 'preact-router/match';
import { MatchProps } from '~app/type';
const s = require('./style.pcss');

const SiteNav: FunctionComponent<{}> = () => {
  const links = {
    '/': 'Blog',
    // '/about': 'About',
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
