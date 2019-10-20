import { h, FunctionComponent } from 'preact';
import Router from 'preact-router';
import Header from '../Header';
import PageResolver from '../PageResolver';
import '~global-styles/style.pcss';

type Props = {
  url?: string;
};

const App: FunctionComponent<Props> = ({ url }: Props) => {
  const routesToPages = {
    '/': 'Blog',
    '/blog/:slug': 'Blog',
    '/about': 'About',
    '/contact': 'Contact',
  };
  return (
    <div id="app">
      <Header />
      <Router url={url}>
        {Object.entries(routesToPages).map(([route, page]) => (
          <PageResolver key={route} path={route} page={page} />
        ))}
      </Router>
    </div>
  );
};

export default App;
