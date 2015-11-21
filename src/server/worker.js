import path from 'path';
import express from 'express';
import webpack from 'webpack';
//import SocketIO from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import socketClusterServer from 'socketcluster-server';

import config from '../webpack/webpack.config.js';
import {login, signup, loginToken, checkEmail} from './controllers/auth';
import {LOAD_LANES, ADD_LANE, UPDATE_LANE, DELETE_LANE} from '../universal/redux/ducks/lanes';
import createSSR from './createSSR.js';
import {liveUpdates} from './database/databaseQueries.js';
import {handleAddDoc, handleUpdateDoc, handleDeleteDoc, handleLoadLanes} from './serverValidation';

const compiler = webpack(config);
const authRouter = express.Router();

module.exports.run = function (worker) {
  if (require("piping")()) {
    console.log('   >> Worker PID:', process.pid);
    const app = express();

    var httpServer = worker.httpServer;
    var scServer = worker.scServer;
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
    httpServer.on('request', app);

    //handle sockets
    scServer.on('connection', function (socket) {
      socket.on('sampleClientEvent', function (data) {
        count++;
        console.log('Handled sampleClientEvent', data);
        scServer.exchange.publish('sample', count);
      });

      var interval = setInterval(function () {
        socket.emit('rand', {
          rand: Math.floor(Math.random() * 5)
        });
      }, 1000);

      socket.on('disconnect', function () {
        clearInterval(interval);
      });
    });
  }
}
