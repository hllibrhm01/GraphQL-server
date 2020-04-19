import { gql } from 'apollo-server';

export default gql`
  extend type Query {
    posts: [Post!]
    post(id: ID!): Post 
  }

  extend type Mutation {
      createPost(
          id: ID!
          users_uuid: ID!
          post_title: String!
          post: String!
      ): Post!

      deletePost(
        id: ID!
      ): Boolean!
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
`;
