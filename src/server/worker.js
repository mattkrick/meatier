import path from 'path';
import express from 'express';
import webpack from 'webpack';
import http from 'http';
import bodyParser from 'body-parser';

import config from '../webpack/webpack.config.js';
import createSSR from './createSSR.js';
import {login, signup, loginToken} from './controllers/auth';

//"live query"
import subscribeMiddleware from './publish/subscribeMiddleware';
import subscribeHandler from './publish/subscribeHandler';
import {ADD_LANE, UPDATE_LANE, DELETE_LANE} from '../universal/redux/ducks/lanes';
import {ADD_NOTE, UPDATE_NOTE, DELETE_NOTE} from '../universal/redux/ducks/notes';
import {addLane, deleteLane, updateLane} from './controllers/lanes';
import {addNote, deleteNote, updateNote} from './controllers/notes';


const compiler = webpack(config);
const authRouter = express.Router();

module.exports.run = function (worker) {
  console.log('   >> Worker PID:', process.pid);
  const app = express();

  const httpServer = worker.httpServer;
  const scServer = worker.scServer;
  //setup middleware
  app.use(bodyParser.json()); //no need for url enconding since no auth stuff will be posted in the url
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(require('serve-static')(path.join(__dirname, 'build')));

  //Auth handler via HTTP (make sure to use HTTPS)
  app.use('/auth', authRouter);
  authRouter.route('/login').post(login);
  authRouter.route('/login-token').post(loginToken);
  authRouter.route('/signup').post(signup);

  //server-side rendering
  app.get('*', createSSR);

  //startup
  httpServer.on('request', app);

  //handle sockets
  scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, subscribeMiddleware);
  scServer.on('connection', function (socket) {
    //hold the client-submitted docs in a queue while they get validated & handled in the DB
    //then, when the DB emits a change, we know if the client caused it or not
    socket.docQueue = new Set();
    console.log('Client connected:', socket.id);
    socket.on('subscribe', subscribeHandler);
    socket.on('disconnect', function (socket) {
      console.log('Client disconnected:', socket.id);
    });
    socket.on(ADD_LANE, addLane)
    socket.on(DELETE_LANE, deleteLane)
    socket.on(UPDATE_LANE, updateLane)
    socket.on(ADD_NOTE, addNote)
    socket.on(DELETE_NOTE, deleteNote)
    socket.on(UPDATE_NOTE, updateNote)
  });

}
//TODO: dont let tokens expire while still connected, depends on PR to SC
