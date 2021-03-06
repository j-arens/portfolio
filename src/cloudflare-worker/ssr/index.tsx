import { GLOBAL } from '~common/type';
import Blog from '~app/pages/Blog';
// import About from '~app/pages/About';
import Contact from '~app/pages/Contact';
import Post from '~app/pages/Post';
import document from './document';
import app from './app';

// this is a placeholder for the recent_posts.json
const recentPosts = JSON.parse(`% RECENT_POSTS %`);

(self as GLOBAL).APP = {
  recentPosts,
  posts: new Map(),
  storageUrl: `${process.env.STORAGE_URL}`,
  components: {
    Blog,
    // About,
    Contact,
    Post,
  },
  ssr: true,
  version: `${process.env.VERSION}`,
};

export default (url: string): string => document(app(url), recentPosts);
