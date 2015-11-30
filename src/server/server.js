import SC from 'socketcluster';
import os from 'os';
import {jwtSecret} from './secrets';


const numCpus = os.cpus().length;
const SocketCluster = SC.SocketCluster;
const socketCluster = new SocketCluster({
  authKey: jwtSecret,
  logLevel: 1,
  workers: 1 || numCpus, //change this to scale vertically
  brokers: 1,
  port: 3000,
  appName: 'Meatier',
  allowClientPublish: false,
  initController: __dirname + '/init.js',
  workerController: __dirname + '/worker.js',
  brokerController: __dirname + '/broker.js',
  socketChannelLimit: 1000,
  rebootWorkerOnCrash: true
});
