import express from 'express';
import {
  index, create, retrieve, update, destroy,
} from '../controllers/userController';

const router = express.Router();

router.get('/', index);
router.post('/', create);
router.get('/:id', retrieve);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;
