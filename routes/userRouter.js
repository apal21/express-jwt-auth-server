import express from 'express';
import {
  index, create, retrieve, update, destroy,
} from '../controllers/userController';
import verifyJWT from '../middlewares/verifyJWT';

const router = express.Router();

router.use(verifyJWT(['admin']));

router.get('/', index);
router.post('/', create);
router.get('/:id', retrieve);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;
