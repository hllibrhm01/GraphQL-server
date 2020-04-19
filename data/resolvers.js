import { find, filter } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import models from '../models/sql';

export default {
  Query: {
    users: async () => await models.User.findAll(),
    user: async (parentValue, { uuid }) => await models.User.findOne({ where: { uuid } }),
  },
  Mutation: {
    register: async (parent, {
      uuid, role, email, username, password, firstname, lastname,
    }) => await models.User.create({
      uuid: uuidv4().toString(), role, email, username, password, firstname, lastname,
    }),
  },
};
