import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import sha256 from 'sha256';
import client from '../models/redisClient';
import User from '../models/user';
import Response from '../middlewares/response';

require('dotenv').config();

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const fields = [];
    if (!email) fields.push('email');
    if (!password) fields.push('password');

    res.statusCode = 400;
    res.send(new Response('Required fields not present', res.statusCode, fields));
    return;
  }

  User.findOne({ email }, (err, data) => {
    if (err || !data) {
      res.statusCode = 400;
      res.send(new Response('Cannot retrieve data', res.statusCode, 'User does not exist').getStructuredResponse());
      return;
    }
    const validPassword = bcrypt.compareSync(password, data.password);
    if (!validPassword) {
      res.statusCode = 401;
      res.send(new Response('Password does not match', res.statusCode).getStructuredResponse());
      return;
    }
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 1; // Current time in UTC + 1 hour
    const jti = uuidv4();
    const token = jwt.sign(
      {
        // eslint-disable-next-line no-underscore-dangle
        id: data._id,
        jti,
        role: data.role,
        iat: Math.floor(Date.now() / 1000),
        exp,
      },
      process.env.PRIVATE_KEY,
      { algorithm: 'RS256' },
    );

    // Store data in redis
    // eslint-disable-next-line no-underscore-dangle
    client.hset(data._id, [jti, sha256(token), `exp-${jti}`, exp], error => {
      if (error) {
        res.statusCode = 500;
        res.send(new Response('Cannot set token in Redis', res.statusCode, error));
        return;
      }
      res.send(new Response({ token }).getStructuredResponse());
    });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.statusCode = 400;
    res.send(new Response('Email is required', res.statusCode).getStructuredResponse());
    return;
  }
  User.findOne({ email }, (err, data) => {
    if (err || !data) {
      res.statusCode = 400;
      res.send(new Response('Cannot find the user', res.statusCode, err || 'User does not exist').getStructuredResponse());
      return;
    }

    User.findOneAndUpdate({ email }, { resetPassword: uuidv4() }, { new: true }, error => {
      if (error) {
        res.statusCode = 500;
        res.send(new Response('Cannot update resetPassword field', res.statusCode, error).getStructuredResponse());
        return;
      }

      // Other Logic goes here... (eg. send email)

      res.send(new Response('Confirmation email sent successfully').getStructuredResponse());
    });
  });
};

const resetPassword = (req, res) => {
  // eslint-disable-next-line no-shadow
  const { email, password, resetPassword } = req.body;
  const { id } = req.params;

  if (!email || !password || !resetPassword) {
    const fields = [];
    if (!email) fields.push('email');
    if (!password) fields.push('password');
    if (!resetPassword) fields.push('resetPassword');

    res.statusCode = 400;
    res.send(new Response('Required fields not present', res.statusCode, fields).getStructuredResponse());
    return;
  }

  if (password !== resetPassword) {
    res.statusCode = 400;
    res.send(new Response('password and resetPassword does not match', res.statusCode).getStructuredResponse());
    return;
  }

  User.findOne({ email }, (err, data) => {
    if (err || !data) {
      res.statusCode = 400;
      res.send(new Response('Cannot find user', res.statusCode, err || 'User does not exist').getStructuredResponse());
      return;
    }

    if (id !== data.resetPassword) {
      res.statusCode = 400;
      res.send(new Response('Invalid or Expired URL id', res.statusCode).getStructuredResponse());
      return;
    }

    User.findOneAndUpdate(
      { email },
      { resetPassword: null, password: bcrypt.hashSync(password) },
      { new: true },
      error => {
        if (error) {
          res.statusCode = 500;
          res.send(new Response('Could not reset password', res.statusCode, error).getStructuredResponse());
          return;
        }

        // Some other logic to acknowledge user about the password change goes here.

        res.send(new Response('Password Updated Successfully').getStructuredResponse());
      },
    );
  });
};

const logout = (req, res) => {
  client.hdel(req.user.id, [req.user.jti, `exp-${req.user.jti}`], err => {
    if (err) {
      res.statusCode = 500;
      res.send(new Response('Could not delete key', res.statusCode).getStructuredResponse());
      return;
    }
    res.send(new Response('Successfully deleted the key').getStructuredResponse());
  });
};

export {
  login, forgotPassword, resetPassword, logout,
};
