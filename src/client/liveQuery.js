import io from 'socket.io-client';
import {camelizeKeys} from 'humps';
import handleChangefeed from './handleChangefeed.js';
import {DOCS_CHANGE} from '../universal/redux/mamaDuck';

export default function liveQuery(store) {
  const socket = io();
    socket.on(DOCS_CHANGE, (change, table) => {
      handleChangefeed(store, table, camelizeKeys(change));
    });
  return socket;
}

