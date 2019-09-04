import { h } from 'preact';
import { Link } from 'preact-router';

const Home = () => {
  return (
    <div>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
};

export default Home;
