import io from 'socket.io-client';
import {addLaneLocally, deleteLaneLocally, updateLaneLocally} from '../universal/redux/ducks/lanes.js';
import {findInState} from '../universal/redux/helpers.js';
import deepEqual from 'deep-equal';
//import {LANES_CHANGE} from '../universal/redux/ducks/lanes.js'
import {camelizeKeys} from 'humps';
import changefeedHandler from '../universal/redux/schemas.js';
import handleChangefeed from '../universal/redux/handleChangefeed.js';

export default function liveQuery(store) {
  const socket = io();
  //const actions = Object.keys(changefeedHandler);
  //actions.forEach(action => {
    socket.on('DOCS_CHANGE', (change, table) => {
      handleChangefeed(store, table, camelizeKeys(change));
      //console.log('received change from db', change, table);
    });
  //});
  return socket;
}

