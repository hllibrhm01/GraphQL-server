import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressSession from 'express-session';
import isAuth from '../middlewares/auth';
import jwt, { verify } from 'jsonwebtoken';
import {
  ApolloServer,
  AuthenticationError,
} from 'apollo-server-express';
import { ACCESS_TOKEN_SECRET } from '../graphql/constants';

import typeDefs from '../graphql/schema';
import resolvers from '../graphql/resolvers';
import models from '../models/sql';

export const initializeExpressApp = () => {
  const app = express();

  app.set('views', path.join(__dirname, ''));
  app.set('view engine', 'jade');

  const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001/graphql'],
  };

  const addUser = async (req) => {
    const token = req.headers.authorization;
    try {
      const { user } = await jwt.verify(token, ACCESS_TOKEN_SECRET);
      req.user = user;
    } catch (err) {
      console.log(err);
    }
    req.next();
  };


  app.use(cors(corsOptions));
  app.use(isAuth);
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
    context: ({ req, res, context }) => ({
      req,
      res,
      context: ({ req }) => ({
        user: req.user
      }),
    }),
  });

  app.use((req, res, next) => {
    const accessToken = req.cookies["access-token"];
    try {
      const data = verify(accessToken, ACCESS_TOKEN_SECRET);
      (req).userId = data.userId;
    } catch {}
    next();
  });

  server.applyMiddleware({ app, path: '/graphql' });

  return app;
};
