/* eslint-disable import/no-unresolved */
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressSession from 'express-session';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';


// import schema from '../schema';
// import resolvers from '../resolvers';
// eslint-disable-next-line import/extensions
// import models from '../models/sql';

import typeDefs from '../data/schema';
import resolvers from '../data/resolvers';

export const initializeExpressApp = () => {
  const app = express();

  app.set('views', path.join(__dirname, ''));
  app.set('view engine', 'jade');

  app.use(cors());
  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(
    expressSession({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
    }),
  );

  const server = new ApolloServer({
    introspection: true,
    typeDefs,
    resolvers,
    formatError: (error) => error,
    context: ({ req, res }) => ({
      req,
      res,
    }),
  });

  server.applyMiddleware({ app, path: '/graphql' });

  return app;
};
