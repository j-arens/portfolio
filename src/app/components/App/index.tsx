import { h } from 'preact';
import Router from 'preact-router';
import Home from '~app/templates/Home';
import TemplateResolver from '../TemplateResolver';

type Props = {
  url?: string,
}

const App = ({ url = undefined }: Props) => {
  return (
    <Router url={url}>
      <Home path="/" />
      <TemplateResolver
        path="/about"
        template="About"
      />
      <TemplateResolver
        path="/contact"
        template="Contact"
      />
    </Router>
  );
};

export default App;
