import express from 'express';
import { create } from '../controllers/userController';
import {
  login, forgotPassword, resetPassword, logout, verify,
} from '../controllers/authController';
import verifyJWT from '../middlewares/verifyJWT';

const router = express.Router();

router.post('/register', create);
router.post('/login', login);
router.post('/forgot', forgotPassword);
router.post('/reset/:id', resetPassword);
router.post('/logout', verifyJWT(['user', 'admin']), logout);
router.post('/verify', verifyJWT(['user', 'admin']), verify);

export default router;
