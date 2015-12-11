import socketOptions from './socketOptions';
import socketCluster from 'socketcluster-client';

/*funny things happen when you create a client socket on a server
* in order to share a socket with a 3rd party package (eg anything from npm)
* you must pass a socket to that package
* you cannot create a socket & rely on the socket's multiplexing
* because in order to share a socket memoization cache, that pacakge would have to expose the cache
* to something in the global scope
* since packages are always imported as constants
* ...the more you know
*/

function createSocket() {
  if (process.env.__CLIENT__) {
    return socketCluster.connect(socketOptions);
  }
}
export default createSocket();
