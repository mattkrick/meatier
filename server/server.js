import path from 'path';
import express from 'express';
import webpack from 'webpack';
import config from '../webpack.config.js';
import SocketIO from 'socket.io';
import http from 'http';
import {addDocToDB} from './rethinkQueries';
import {ADD_DOC} from '../universal/redux/ducks/docs.js';
import createSSR from './createSSR.js';
import {liveUpdates} from './rethinkQueries.js';
import rootSchema from '../universal/redux/schemas.js';
import Joi from 'joi';
//import promisify from 'es6-promisify';

//const validate = promisify(Joi.validate);

const port = 3000;
const app = express();
const httpServer = http.Server(app);
const compiler = webpack(config);
const io = SocketIO(httpServer);

if (require("piping")()) {

//setup app
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  app.use(require('serve-static')(path.join(__dirname, 'build')));
//app.use(bodyParser.urlencoded({
//  extended: true
//}));
//app.use(bodyParser.json());
  app.get('/', createSSR);

//listen to the db for new data
  liveUpdates(io);

//setup websockets
  io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on(ADD_DOC, (document, table, cb) => {
      //ADD VALIDATION HERE
      //console.log(document, table, cb);
      //const schema = rootSchema[table];
      //
      //if (!schema) return cb('Cannot find schema on server');
      //document.id = '';
      //const schemaError = Joi.validate(document, schema).error;
      //if (schemaError) return cb(schemaError.message);
      delay(500)
        .then(() => addDocToDB(document, table))
        .then(success => cb(null, success))
        .catch(dbError => cb(dbError));
    });
  });


  httpServer.listen(port);
  function delay(ms) {
    return new Promise(function (resolve, reject) {
      setTimeout(resolve, ms);
    });
  }
}

