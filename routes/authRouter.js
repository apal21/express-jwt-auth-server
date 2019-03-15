import express from 'express';
import { create } from '../controllers/userController';
import { login } from '../controllers/authController';

const router = express.Router();

router.post('/register', create);
router.post('/login', login);

export default router;
