import { gql } from 'apollo-server-express';

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
        users: [User!]
        user(uuid: ID!): User
    }

    type Mutation {
       register(
        uuid: ID
        role: String!
        email: String!
        username: String!
        password: String!
        firstname: String!
        lastname: String!
        ): User!
    }
`;

export default typeDefs;
