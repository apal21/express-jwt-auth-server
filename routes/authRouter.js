import express from 'express';
import { create } from '../controllers/userController';
import { login, forgotPassword } from '../controllers/authController';

const router = express.Router();

router.post('/register', create);
router.post('/login', login);
router.post('/forgot', forgotPassword);

export default router;
