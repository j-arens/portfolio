import { h, hydrate } from 'preact';
import App from './components/App';

const root = document.getElementById('app');

if (root instanceof Element) {
  hydrate(<App />, root);
}
