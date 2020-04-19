/* eslint-disable import/no-named-as-default-member */
import { gql } from 'apollo-server-express';

import userSchema from './user';
// eslint-disable-next-line import/no-named-as-default
import postSchema from './post';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, postSchema];
