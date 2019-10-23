import { h, FunctionComponent } from 'preact';
import { useDelay } from '~app/hooks';
import Spinner from '../Spinner';
const s = require('./style.pcss');

type Props = {
  delay?: number;
};

const PageSpinner: FunctionComponent<Props> = ({ delay = 1000 }: Props) => {
  // it can feel a little janky to show the spinner for only a split second
  // if a component loads quick enough, delay for a short amount of time before
  // rendering anything
  const delayed = useDelay(delay);
  if (!delayed) {
    return null;
  }
  return (
    <main role="main">
      <div class={s.pageSpinner}>
        <Spinner className={s.spinner} />
      </div>
    </main>
  );
};

export default PageSpinner;
