import users from './userRouter';
import auth from './authRouter';

const routes = app => {
  app.use('/users', users);
  app.use('/auth', auth);
};

export default routes;
