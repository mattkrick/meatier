import SC from 'socketcluster';
import os from 'os';
import {jwtSecret} from './secrets';

const numCpus = os.cpus().length;
const SocketCluster = SC.SocketCluster;
const socketCluster = new SocketCluster({
  authKey: jwtSecret,
  logLevel: 1,
  // change this to scale vertically
  workers: 1 || numCpus,
  brokers: 1,
  port: 3000,
  appName: 'Meatier',
  allowClientPublish: false,
  initController: path.join(__dirname, '/init.js'),
  workerController: path.join(__dirname, '/worker.js'),
  brokerController: path.join(__dirname, '/broker.js'),
  socketChannelLimit: 1000,
  rebootWorkerOnCrash: true
});
