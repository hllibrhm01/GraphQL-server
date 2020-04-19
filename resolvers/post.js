import Sequelize from 'sequelize';
// import { combineResolvers } from 'graphql-resolvers';

export default {
  Query: {
    posts: async () => await models.Post.findAll({ order: [['createdAt', 'DESC']] }),
    post: async (parent, { id }, { models }) => await models.Post.findById({ where: { id } }),
  },

  Mutation: {
    createPost: (parent, { id }, { users_uuid }, { post_title }, { post }) => {
      const postPro = {
        id,
        users_uuid,
        post_title,
        post,
      };
      return postPro;
    },
  },
};
