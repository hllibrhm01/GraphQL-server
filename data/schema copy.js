import resolvers from './resolvers';

const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
    scalar Date

    type User {
        uuid: ID!
        role: String!
        email: String!
        username: String!
        password: String!
        firstname: String!
        lastname: String!
        createdAt: Date
        updatedAt: Date
        deletedAt: Date
    }

    type Post {
        id: ID!
        users_uuid: ID!
        post_title: String!
        post: String!
        createdAt: Date
        updatedAt: Date
        deletedAt: Date
    }

    type Query {
        allUsers: [User]
        fetchUser(uuid: Int!): User
        allPosts: [Post]
        fetchPost(id: Int!): Post
    }

    type Mutation {
        login (
            email: String!,
            password: String!
        ): String
        createUser (
            uuid: ID!
            role: String!
            email: String!
            username: String!
            password: String!
            firstname: String!
            lastname: String!
        ): User
        updateUser (
            uuid: Int!,
            firstName: String!,
            lastName: String,
            email: String!,
            password: String!
        ): User

        addPost (
            title: String!,
            content: String!,
            status: Boolean
            tags: [Int!]!
        ): Post
        updatePost (
            id: Int!,
            title: String!,
            content: String!,
            status: Boolean,
            tags: [Int!]!
        ): Post
        deletePost (
            id: Int!
        ): Boolean
    }
`;

export default makeExecutableSchema({ typeDefs, resolvers });
