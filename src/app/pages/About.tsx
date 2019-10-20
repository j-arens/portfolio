import { h, FunctionComponent } from 'preact';
import Bio from '../components/Bio';

const About: FunctionComponent<{}> = () => {
  return (
    <main role="main">
      <Bio />
    </main>
  );
};

export default About;
