import Router from './Router';
import MutableResponse from './MutableResponse';
import * as app from '../app';

const router = new Router();

// router.post('/contact', (req: Request, res: MutableResponse): MutableResponse => {
//   return api.contact();
// });

router.all(
  '*',
  (req: Request, res: MutableResponse): MutableResponse =>
    res.body(app.render(req.url)),
);

export default router;
