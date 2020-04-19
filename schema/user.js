import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(
      uuid: ID!
      email: String!
      username: String!
      password: String!
      firstname: String!
      lastname: String!
    ): Token!

    signIn(login: String!, password: String!): Token!
    updateUser(username: String!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

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
`;
