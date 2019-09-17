import { h } from 'preact';
import Router from 'preact-router';
import Header from '../Header';
import TemplateResolver from '../TemplateResolver';
import '~global-styles/style.pcss';

type Props = {
  url?: string;
};

const App = ({ url }: Props): h.JSX.Element => {
  const routesToTemplates = {
    '/': 'Blog',
    '/blog/:slug': 'Blog',
    '/about': 'About',
    '/contact': 'Contact',
  };
  return (
    <div id="app">
      <Header />
      <Router url={url}>
        {Object.entries(routesToTemplates).map(([route, template]) => (
          <TemplateResolver key={route} path={route} template={template} />
        ))}
      </Router>
    </div>
  );
};

export default App;
