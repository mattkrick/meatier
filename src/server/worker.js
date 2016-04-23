import express from 'express';
import webpack from 'webpack';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';

import config from '../../webpack/webpack.config.dev';
import createSSR from './createSSR';
import {googleAuthUrl, googleAuthCallback} from './graphql/models/User/oauthGoogle';
import {wsGraphQLHandler, wsGraphQLSubHandler} from './graphql/wsGraphQLHandlers';
import httpGraphQLHandler from './graphql/httpGraphQLHandler';

const PROD = process.env.NODE_ENV === 'production';

export function run(worker) {
  console.log('   >> Worker PID:', process.pid);
  const app = express();
  const scServer = worker.scServer;
  const httpServer = worker.httpServer;
  httpServer.on('request', app);

  // HMR
  if (!PROD) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }

  // setup middleware
  app.use(bodyParser.json());
  app.use(cors({origin: true, credentials: true}));
  app.use((req, res, next) => {
    if (/\/favicon\.?(jpe?g|png|ico|gif)?$/i.test(req.url)) {
      res.status(404).end();
    } else {
      next();
    }
  });
  if (PROD) {
    app.use(compression());
    app.use('/static', express.static('build'));
  }

  // Oauth
  app.get('/auth/google', (req, res) => res.redirect(googleAuthUrl));
  app.get('/auth/google/callback', googleAuthCallback);

  // HTTP GraphQL endpoint
  app.post('/graphql', jwt({secret: process.env.JWT_SECRET, credentialsRequired: false}), httpGraphQLHandler);

  // server-side rendering
  app.get('*', createSSR);

  // handle sockets
  scServer.on('connection', socket => {
    console.log('Client connected:', socket.id);
    // hold the client-submitted docs in a queue while they get validated & handled in the DB
    // then, when the DB emits a change, we know if the client caused it or not
    socket.docQueue = new Set();
    socket.on('graphql', wsGraphQLHandler);
    socket.on('subscribe', wsGraphQLSubHandler);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
}
// TODO: dont let tokens expire while still connected, depends on PR to SC
