import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import router from './routes';
import './models';

import './cron/redisCron';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Setup Routes
router(app);

export default app;
