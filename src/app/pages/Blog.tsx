import { h, FunctionComponent } from 'preact';
import RecentPosts from '../components/RecentPosts';
require('./style.pcss');

const Blog: FunctionComponent<{}> = () => (
  <main class="has-dynamic-styles" role="main">
    <RecentPosts />
  </main>
);

export default Blog;
