import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/auth', { useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error'));
db.once('open', () => {
  console.log('DB connected');
});
