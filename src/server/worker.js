import express from 'express';
import webpack from 'webpack';
import compression from 'compression';
import config from '../../webpack/webpack.config.dev';
import createSSR from './createSSR';
import makeAuthEndpoints from './controllers/makeAuthEndpoints';

// "live query"
import subscribeMiddleware from './publish/subscribeMiddleware';
import subscribeHandler from './publish/subscribeHandler';
import {ADD_LANE, UPDATE_LANE, DELETE_LANE} from '../universal/redux/ducks/lanes';
import {ADD_NOTE, UPDATE_NOTE, DELETE_NOTE} from '../universal/redux/ducks/notes';
import {addLane, deleteLane, updateLane} from './controllers/lanes';
import {addNote, deleteNote, updateNote} from './controllers/notes';

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
  // Auth handler via HTTP (make sure to use HTTPS)
  makeAuthEndpoints(app)

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
    socket.on('subscribe', subscribeHandler);
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
    socket.on(ADD_LANE, addLane);
    socket.on(DELETE_LANE, deleteLane);
    socket.on(UPDATE_LANE, updateLane);
    socket.on(ADD_NOTE, addNote);
    socket.on(DELETE_NOTE, deleteNote);
    socket.on(UPDATE_NOTE, updateNote);
  });
}
// TODO: dont let tokens expire while still connected, depends on PR to SC
