import {SocketCluster} from 'socketcluster';
import os from 'os';
import {jwtSecret} from './secrets';
import path from 'path';

const numCpus = os.cpus().length;

if (process.env.SERVER_PORT) {} else {
  process.env['SERVER_PORT'] = '3000';
}

if (process.env.GRAPHQL_HOST) {} else {
  process.env['GRAPHQL_HOST'] = 'localhost';
}

if (process.env.GRAPHQL_PROTOCOL) {} else {
  process.env['GRAPHQL_PROTOCOL'] = 'http:';
}

export const options = {
  authKey: jwtSecret,
  logLevel: 1,
  // change this to scale vertically
  workers: 1 || numCpus,
  brokers: 1,
  port: process.env.SERVER_PORT,
  appName: 'Meatier',
  allowClientPublish: false,
  initController: path.join(__dirname, '/init.js'),
  workerController: path.join(__dirname, '/worker.js'),
  brokerController: path.join(__dirname, '/broker.js'),
  socketChannelLimit: 1000,
  rebootWorkerOnCrash: true
};

new SocketCluster(options); // eslint-disable-line no-new
