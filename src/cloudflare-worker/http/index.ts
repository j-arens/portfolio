import Router from './Router';
import MutableResponse from './MutableResponse';
import * as app from '../app';
import * as api from '../api';

const router = new Router();

router.post('/contact', api.contact);

router.all(
  '*',
  (req: Request, res: MutableResponse): MutableResponse =>
    res.body(app.render(req.url)),
);

export default router;
