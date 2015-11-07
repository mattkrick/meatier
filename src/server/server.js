import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from '../../webpack/dev.config.js';
import SocketIO from 'socket.io';
import http from 'http';
import {ADD_DOC, UPDATE_DOC, DELETE_DOC} from '../universal/redux/ducks/docs.js';
import createSSR from './createSSR.js';
import {liveUpdates} from './databaseQueries.js';
import {handleAddDoc, handleUpdateDoc, handleDeleteDoc} from './serverValidation';

//import promisify from 'es6-promisify';

//const validate = promisify(Joi.validate);

const port = 3000;
const app = express();
const httpServer = http.Server(app);
const compiler = webpack(config);
const io = SocketIO(httpServer);

if (require("piping")()) {
  //console.log(process.env);
//setup app
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(require('serve-static')(path.join(__dirname, 'build')));
  app.get('/', createSSR);

//listen to the db for new data
  liveUpdates(io);

//setup websockets
  io.on('connection', function (socket) {
    socket.on(ADD_DOC, handleAddDoc);
    socket.on(UPDATE_DOC, handleUpdateDoc);
    socket.on(DELETE_DOC, handleDeleteDoc);
  });
  httpServer.listen(port);
}

