import jwt from 'jsonwebtoken';
import { AuthenticationError, UserInputError } from 'apollo-server';
// import { combineResolvers } from 'graphql-resolvers';

const createToken = async (user, secret, expiresIn) => {
  const {
    uuid, email, username, role,
  } = user;
  return await jwt.sign({
    uuid, email, username, role,
  }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent, args, { models }) => await models.User.findAll(),
    user: async (parent, { uuid }, { models }) => await models.User.findOne({ where: { uuid } }),
  },

  Mutation: {
    signUp: async (
      parent,
      {
        uuid, email, username, password, firstname, lastname,
      },
      { models, secret },
    ) => {
      const user = await models.User.create({
        uuid,
        email,
        username,
        password,
        firstname,
        lastname,
      });
    },

    signIn: async (
      parent,
      { login, password },
      { models, secret },
    ) => {
      const user = await models.User.findByLogin(login);

      if (!user) {
        throw new UserInputError(
          'No user found with this login credentials.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '30m') };
    },

  },
};
