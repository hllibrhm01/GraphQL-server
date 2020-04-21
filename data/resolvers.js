/* eslint-disable consistent-return */
import { find, filter } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt, { sign } from 'jsonwebtoken';
// import jwt from 'jsonwebtoken';
import slugify from 'slugify';
import models from '../models/sql';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './constants';

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
    login: async (parent, { username, password }, { res }) => {
      const user = await models.User.findOne({ where: { username } });
      if (!user) {
        throw new Error('No user with username');
      }
      const valid = bcrypt.compareSync(password, user.password);
      if (!valid) {
        throw new Error('Incorrect password');
      }
      const refreshToken = sign(
        { uuid: user.uuid },
        REFRESH_TOKEN_SECRET,
        {
          expiresIn: '7d',
        },
      );
      const accessToken = sign({ uuid: user.uuid }, ACCESS_TOKEN_SECRET, {
        expiresIn: '15min',
      });

      res.cookie('refresh-token', refreshToken);
      res.cookie('access-token', accessToken);

      return user;
      /*
      return user;
      return jwt.sign({
        uuid: user.uuid,
        username: user.username,
      }, 'asdsadsadhasjdashbdasd7asdasghjd', { expiresIn: '1y' });
      */
    },
  },
};
