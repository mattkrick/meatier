import r from 'rethinkdb';
import configFile from './rethink.config.js';
import {LANES} from '../universal/redux/ducks/lanes.js'
import {DOCS_CHANGE} from '../universal/redux/ducks/docs.js'
//import xss from 'xss';

const {tables, ...config } = configFile;

function connect() {
  return r.connect(config);
}

export function liveUpdates(io) {
  //console.log('Setting up listener...');
  connect()
    .then(conn => {
      r
        .table(LANES)
        .changes().run(conn, (err, cursor) => {
          console.log('Listening for lane changes...');
          cursor.each((err, change) => {
            //console.log('Change detected, emitting:', LANES_CHANGE, change);
            io.emit(DOCS_CHANGE, change, LANES);
          });
        });
    });
}
//export function liveUpdates(io) {
//  console.log('Setting up listener...');
//  connect().then(conn => {
//    console.log(tables);
//
//    Promise.all(tables.map((table) => {
//      console.log(table)
//      r.table[table].changes().run(conn, (err, cursor) => {
//        console.log('Listening for changes...');
//        cursor.each((err, change) => {
//          console.log('Change detected', change);
//          io.emit('event-change', change);
//        });
//      });
//    }));
//  })
//}


export function getState() {
  return connect()
    .then(conn => {
      return r
        .table('lanes')
        .orderBy('id').run(conn)
        .then(cursor => cursor.toArray());
    });
}

export function addDocToDB(document, table) {
  return connect()
    .then(conn => {
      //document.createdAt = new Date();
      //document, table.text = xss(document, table.text);
      return r
        .table(table)
        .insert(document).run(conn)
        .then(response => {
          if (response.errors) {
            throw 'Duplicate ID';
          }
          return response.inserted; //should always be 1
        });
    });
}

export function updateEvent(id, event) {
  event.updated = new Date();
  event.text = xss(event.text);
  return connect()
    .then(conn => {
      return r
        .table('lanes')
        .get(id).update(event).run(conn)
        .then(() => event);
    });
}

export function deleteEvent(id) {
  return connect()
    .then(conn => {
      return r
        .table('lanes')
        .get(id).delete().run(conn)
        .then(() => ({id: id, deleted: true}));
    });
}
