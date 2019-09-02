import { h } from 'preact';
import Router from 'preact-router';
import AsyncRoute from 'preact-async-route';
import Home from '~app/templates/Home';
import { moduleResolver } from '~app/utils';

const App = () => {
  return (
    <Router>
      <Home path="/" />
      <AsyncRoute
        path="/about"
        getComponent={moduleResolver('About')}
        // loading={}
      />
      <AsyncRoute
        path="/contact"
        getComponent={moduleResolver('Contact')}
        // loading={}
      />
      <AsyncRoute
        path="/work/:slug"
        getComponent={moduleResolver('Article')}
        // loading={}
      />
    </Router>
  );
};

export default App;
