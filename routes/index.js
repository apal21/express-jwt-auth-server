import users from './userRouter';

const routes = app => {
  app.use('/users', users);
};

export default routes;
