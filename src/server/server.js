import path from 'path';
import express from 'express';
import webpack from 'webpack';
import SocketIO from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';

import config from '../webpack/webpack.config.js';
import {login, signup, loginToken, checkEmail} from './controllers/auth';
import {LOAD_LANES, ADD_LANE, UPDATE_LANE, DELETE_LANE} from '../universal/redux/ducks/lanes';
import createSSR from './createSSR.js';
import {liveUpdates} from './database/databaseQueries.js';
import {handleAddDoc, handleUpdateDoc, handleDeleteDoc, handleLoadLanes} from './serverValidation';

const port = 3000;
const app = express();
const compiler = webpack(config);
const httpServer = http.Server(app);
const io = SocketIO(httpServer);
const authRouter = express.Router();


if (require("piping")()) {

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
  authRouter.route('/check-email').post(checkEmail);

  //server-side rendering
  app.get('*', createSSR);

  //startup
  httpServer.listen(port);

//listen to the db for new data
//  liveUpdates(io);

//setup websockets
  io.on('connection', function (socket) {
    socket.on(ADD_LANE, handleAddDoc);
    socket.on(UPDATE_LANE, handleUpdateDoc);
    socket.on(DELETE_LANE, handleDeleteDoc);
    socket.on(LOAD_LANES, handleLoadLanes);
  });

}

