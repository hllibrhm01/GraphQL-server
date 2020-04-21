/* eslint-disable consistent-return */
import { find, filter } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import slugify from 'slugify';
import models from '../models/sql';

export default {
  Query: {
    users: async () => await models.User.findAll(),
    user: async (parentValue, { uuid }) => await models.User.findOne({ where: { uuid } }),
  },
  Mutation: {
    register: async (parent, {
      uuid, role, email, username, password, firstname, lastname,
    }) => await bcrypt.hash(password, 10, (err, hash) => {
      models.User.create({
        uuid: uuidv4().toString(),
        role,
        email,
        username,
        password: hash,
        firstname,
        lastname,
      });
      return true;
    }),
    login: async (parent, { username, password }) => {
      const user = await models.User.findOne({ where: { username } });
      if (!user) {
        throw new Error('No user with username');
      }
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }
      // return user;
      return jwt.sign({
        uuid: user.uuid,
        username: user.username,
      }, process.env.JWT_SECRET, { expiresIn: '1y' });
    },
  },
};
