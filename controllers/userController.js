import uuidv4 from 'uuid/v4';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import Response from '../middlewares/response';

const index = (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.send(err);
      return;
    }
    res.send(new Response(data).getStructuredResponse());
  });
};

const create = (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    const fields = [];
    if (!email) fields.push('email');
    if (!name) fields.push('name');
    if (!password) fields.push('password');

    res.statusCode = 400;
    res.send(new Response(
      'Required fields not present', res.statusCode, fields,
    ).getStructuredResponse());
    return;
  }

  User.create({
    _id: uuidv4(),
    email,
    password: bcrypt.hashSync(password),
    name,
  }, (err, data) => {
    if (err) {
      res.statusCode = 400;
      res.send(new Response('Cannot Create User', res.statusCode, err).getStructuredResponse());
      return;
    }
    res.send(new Response('User created successfully', res.statusCode, data).getStructuredResponse());
  });
};

const retrieve = (req, res) => {
  const { id } = req.params;
  User.findById({ _id: id }, (err, data) => {
    if (err || !data) {
      res.statusCode = 400;
      res.send(new Response('Cannot retrieve data', res.statusCode, err || 'User does not exist').getStructuredResponse());
      return;
    }
    res.send(new Response(data).getStructuredResponse());
  });
};

const update = (req, res) => {
  const { id } = req.params;
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    const fields = [];
    if (!email) fields.push('email');
    if (!name) fields.push('name');
    if (!password) fields.push('password');

    res.statusCode = 400;
    res.send(new Response(
      'Required fields not present', res.statusCode, fields,
    ).getStructuredResponse());
    return;
  }

  User.findOneAndUpdate(
    { _id: id },
    { email, password: bcrypt.hashSync(password), name },
    { new: true },
    (err, data) => {
      if (err || !data) {
        res.statusCode = 400;
        res.send(new Response('Cannot update data', res.statusCode, err || 'User does not exist').getStructuredResponse());
        return;
      }
      res.send(new Response(data).getStructuredResponse());
    },
  );
};

const destroy = (req, res) => {
  const { id } = req.params;
  User.findOneAndRemove({ _id: id }).exec((err, data) => {
    if (err || !data) {
      res.statusCode = 400;
      res.send(new Response(
        'Couldn\'nt delete user', res.statusCode, err || 'User does not exist',
      ).getStructuredResponse());
      return;
    }
    res.send(new Response('User deleted successfully', res.statusCode, data).getStructuredResponse());
  });
};

export {
  index, create, retrieve, update, destroy,
};
