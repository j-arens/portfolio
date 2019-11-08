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
    // if theres more than one dot in the url then were
    // just gonna go ahead and assume the request is for
    // a file
    const parts = req.url.split('.');
    if (parts.length > 2) {
      return res.status(404);
    }
    const { pathname } = new URL(req.url);
    return res.header('Content-Type', 'text/html').body(ssr(pathname));
  },
);

export default router;
