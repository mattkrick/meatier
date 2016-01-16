import express from 'express';
import webpack from 'webpack';
import compression from 'compression';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from '../../webpack/webpack.config.dev';
import createSSR from './createSSR';
import makeAuthEndpoints from './controllers/makeAuthEndpoints';
import {graphql} from 'graphql';
import Schema from './graphql/rootSchema';
import jwt from 'express-jwt';
import {jwtSecret} from './secrets';
import {prepareClientError} from './graphql/models/utils';

// "live query"
import subscribeMiddleware from './publish/subscribeMiddleware';
import subscribeHandler from './publish/subscribeHandler';

const PROD = process.env.NODE_ENV === 'production';

export function run(worker) {
  console.log('   >> Worker PID:', process.pid);
  const app = express();
  const httpServer = worker.httpServer;
  const scServer = worker.scServer;

  // HMR
  if (!PROD) {
    const compiler = webpack(config);
    app.use(require('webpack-dev-middleware')(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath
    }));
    app.use(require('webpack-hot-middleware')(compiler));
  }
  app.use(bodyParser.json());
  app.use(cors({origin: true, credentials: true}));
  // setup middleware
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

  // HTTP GraphQL endpoint
  app.post('/graphql', jwt({secret: jwtSecret, credentialsRequired: false}), async (req, res) => {
    // Check for admin privileges
    const {query, variables, ...rootVals} = req.body;
    const authToken = req.user || {};
    console.log('RV', rootVals)
    const result = await graphql(Schema, query, {authToken, ...rootVals}, variables);
    res.send(result);
  })

// server-side rendering
  app.get('*', createSSR);

// startup
  httpServer.on('request', app);

// handle sockets
  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, subscribeMiddleware);
  scServer.on('connection', socket => {
    // hold the client-submitted docs in a queue while they get validated & handled in the DB
    // then, when the DB emits a change, we know if the client caused it or not
    console.log('Client connected:', socket.id);
    socket.docQueue = new Set();
    socket.on('graphql', async (body, cb) => {
      const {query, variables, ...rootVals} = body;
      const authToken = socket.getAuthToken();
      const docId = variables.doc && variables.doc.id || variables.id;
      if (!docId) {
        console.warn('No documentId found for the doc submitted via websockets!');
      }
      socket.docQueue.add(docId);
      const result = await graphql(Schema, query, {authToken, ...rootVals}, variables);
      const {error, data} = prepareClientError(result);
      if (error) {
        socket.docQueue.delete(docId);
      }
      cb(error, data);
    })
    socket.on('subscribe', subscribeHandler);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });
}
// TODO: dont let tokens expire while still connected, depends on PR to SC
