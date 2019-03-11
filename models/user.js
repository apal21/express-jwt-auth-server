import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      // eslint-disable-next-line no-useless-escape
      validator: v => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v),
      message: props => `${props.value} is not a valid email id!`,
    },
  },
  password: {
    type: String,
    required: true,
    min: [6, 'Password too small'],
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  resetPassword: {
    type: String,
    required: false,
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const User = mongoose.model('User', userSchema);

export default User;
