
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const slugify = require('slugify');
const { User, Post } = require('../models/sql');

// Define resolvers
const resolvers = {
  Query: {
    async allUsers() {
      return await User.all();
    },

    async fetchUser(_, { uuid }) {
      return await User.findById(uuid);
    },

    async allPosts() {
      return await Post.all();
    },

    async fetchPost(_, { id }) {
      return await Post.findById(id);
    },
  },

  Mutation: {
    async login(_, { email, password }) {
      const user = await User.findOne({ where: { email } });
      return user;
    /*
      if (!user) {
        throw new Error('No user with that email');
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        throw new Error('Incorrect password');
      }

      // Return json web token
      return jwt.sign({
        id: user.id,
        email: user.email,
      }, process.env.JWT_SECRET, { expiresIn: '1y' });
      */
    },

    async createUser(_, {
      firstName, lastName, email, password,
    }) {
      return await User.create({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
      });
    },

    // Update a particular user
    async updateUser(_, {
      id, firstName, lastName, email, password,
    }, { authUser }) {
      // Make sure user is logged in
      if (!authUser) {
        throw new Error('You must log in to continue!');
      }

      // fetch the user by it ID
      const user = await User.findById(id);

      // Update the user
      await user.update({
        firstName,
        lastName,
        email,
        password: await bcrypt.hash(password, 10),
      });

      return user;
    },

    // Add a new post
    async addPost(_, {
      title, content, status, tags,
    }, { authUser }) {
      // Make sure user is logged in
      if (!authUser) {
        throw new Error('You must log in to continue!');
      }

      const user = await User.findOne({ where: { id: authUser.id } });

      const post = await Post.create({
        userId: user.id,
        title,
        slug: slugify(title, { lower: true }),
        content,
        status,
      });

      // Assign tags to post
      await post.setTags(tags);

      return post;
    },

    // Update a particular post
    async updatePost(_, {
      id, title, content, status, tags,
    }, { authUser }) {
      // Make sure user is logged in
      if (!authUser) {
        throw new Error('You must log in to continue!');
      }

      // fetch the post by it ID
      const post = await Post.findById(id);

      // Update the post
      await post.update({
        title,
        slug: slugify(title, { lower: true }),
        content,
        status,
      });

      // Assign tags to post
      await post.setTags(tags);

      return post;
    },

    // Delete a specified post
    async deletePost(_, { id }, { authUser }) {
      // Make sure user is logged in
      if (!authUser) {
        throw new Error('You must log in to continue!');
      }

      // fetch the post by it ID
      const post = await Post.findById(id);

      return await post.destroy();
    },
  },
/*
  User: {
    // Fetch all posts created by a user
    async posts(user) {
      return await user.getPosts();
    },
  },

  Post: {
    // Fetch the author of a particular post
    async user(post) {
      return await post.getUser();
    },

    // Fetch alls tags that a post belongs to
    async tags(post) {
      return await post.getTags();
    },
  },
*/
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date type',

    parseValue(value) {
      // value from the client
      return new Date(value);
    },

    serialize(value) {
      const date = new Date(value);

      // value sent to the client
      return date.toISOString();
    },

    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        // ast value is always in string format
        return parseInt(ast.value, 10);
      }

      return null;
    },
  }),
};

export default resolvers;
