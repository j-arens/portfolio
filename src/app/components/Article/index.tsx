import { h } from 'preact';

type Props = {
  id: string;
};

const Article = ({ id }: Props): h.JSX.Element => {
  return <div>{id}</div>;
};

export default Article;

// store state in APP namespace on the window
// store article fetcher on APP?
