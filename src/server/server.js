import SC from 'socketcluster';
import os from 'os';

const numCpus = os.cpus().length;
const SocketCluster = SC.SocketCluster;
const socketCluster = new SocketCluster({
  workers: 1 || numCpus,
  brokers: 1,
  port: 3000,
  appName: 'Meatier',
  workerController: __dirname + '/worker.js',
  brokerController: __dirname + '/broker.js',
  socketChannelLimit: 1000,
  rebootWorkerOnCrash: argv['auto-reboot'] != false
});
