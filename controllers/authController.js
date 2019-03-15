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

// eslint-disable-next-line
export { login };
