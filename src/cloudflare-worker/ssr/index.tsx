import { GLOBAL } from '~common/type';
import Blog from '~app/pages/Blog';
import About from '~app/pages/About';
import Contact from '~app/pages/Contact';
import Post from '~app/pages/Post';
import document from './document';
import app from './app';

// this is a placeholder for the recent_posts.json that is generated
// when the markdown posts are parsed
const recentPosts = JSON.parse(`<!-- % RECENT_POSTS % -->`);

(self as GLOBAL).APP = {
  recentPosts,
  posts: new Map(),
  storageUrl: `${process.env.STORAGE_URL}`,
  components: {
    Blog,
    About,
    Contact,
    Post,
  },
  ssr: true,
};

export default (url: string): string => document(app(url), recentPosts);
