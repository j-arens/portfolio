import { h, render } from 'preact';
import App from './components/App';

const root = document.getElementById('root');
const app = document.getElementById('app');

if (root instanceof Element && app instanceof Element) {
  render(<App />, root, app);
}