import mongoose from 'mongoose';

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('DB connected');
});
