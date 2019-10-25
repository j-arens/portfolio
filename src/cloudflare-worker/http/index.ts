import Router from './Router';
import MutableResponse from './MutableResponse';
import ssr from '../ssr';
import * as api from '../api';

const router = new Router();

// contact form submissions
router.post('/contact', api.contact);

// everthing else...
router.all(
  '*',
  (req: Request, res: MutableResponse): MutableResponse => {
    // no static assets here...
    if (req.url.match(/\..+$/)) {
      return res.status(404);
    }
    const { pathname } = new URL(req.url);
    return res.body(ssr(pathname));
  },
);

export default router;
