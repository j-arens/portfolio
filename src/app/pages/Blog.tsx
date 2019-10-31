import { h, FunctionComponent } from 'preact';
import RecentPosts from '../components/RecentPosts';

const Blog: FunctionComponent<{}> = () => (
  <main role="main">
    <RecentPosts />
  </main>
);

export default Blog;
