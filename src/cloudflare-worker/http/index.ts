import Router from './Router';
import MutableResponse from './MutableResponse';
import * as app from '../app';
import * as api from '../api';

const router = new Router();

router.post('/contact', api.contact);

router.all(
  '*',
  (req: Request, res: MutableResponse): MutableResponse => {
    // no static assets here...
    if (req.url.match(/\..+$/)) {
      return res.status(404);
    }
    const { pathname } = new URL(req.url);
    return res.body(app.render(pathname));
  },
);

export default router;
