import { h } from 'preact';
import { render as renderToString } from 'preact-render-to-string';
import App from '~app/components/App';

// render the app into a string that can be placed into a document
export default (url: string): string => renderToString(<App url={url} />);
