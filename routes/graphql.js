import { Router } from 'express';
import graphqlHTTP from 'express-graphql';
import config from '../config/config.json';
import schema from '../schema';

const router = Router();

router.use('/', graphqlHTTP({
  schema,
  graphiql: true,
}));

export default router;
