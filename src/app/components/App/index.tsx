import { h, FunctionComponent } from 'preact';
import Router from 'preact-router';
import Header from '../Header';
import PageResolver from '../PageResolver';
import NotFound from '../NotFound';
import '~global-styles/style.pcss';

type Props = {
  url?: string;
};

const App: FunctionComponent<Props> = ({ url }: Props) => {
  enum RoutesToPages {
    '/' = 'Blog',
    '/blog/:slug' = 'Blog',
    '/about' = 'About',
    '/contact' = 'Contact',
  }
  return (
    <div id="app">
      <Header />
      <Router url={url}>
        {Object.entries(RoutesToPages).map(([route, page]) => (
          <PageResolver key={route} path={route} page={page} />
        ))}
        <NotFound default />
      </Router>
    </div>
  );
};

export default App;
