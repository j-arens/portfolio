import { h } from 'preact';
const s = require('./style.pcss');

type Props = {
  className?: string;
  color?: string;
};

const Spinner = ({ className = '', color = '' }: Props): h.JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class={`${s.spinner} ${className}`}
    >
      <circle stroke={color} cx="12" cy="12" r="10" />
    </svg>
  );
};

export default Spinner;
