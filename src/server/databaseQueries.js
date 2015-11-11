import r from 'rethinkdb';
import config from './rethink.config.js';
import {LANES} from '../universal/redux/ducks/lanes.js';
import {DOCS_CHANGE} from '../universal/redux/mamaDuck';

//const {tables, ...config } = config;

function connect() {
  return r.connect(config);
}

export function liveUpdates(io) {
  //console.log('Setting up listener...');
  let subs = ['lanes', 'notes'];
  subs.forEach(table => {
    connect()
      .then(conn => {
        r
          .table(table)
          .changes().run(conn, (err, cursor) => {
          console.log(`Listening for ${table} changes...`);
          cursor.each((err, change) => {
            //console.log('Change detected, emitting:', LANES_CHANGE, change);
            io.emit(DOCS_CHANGE, change, table);
          });
        });
      });
  })
}

export function readTable(table) {
  return connect()
    .then(conn => {
      return r
        .table(table)
        .orderBy('id').run(conn)
        .then(cursor => cursor.toArray());
    });
}

export function getState(subs) {
  return Promise.all(subs.map(readTable))
}

export function addDocToDB(document, table) {
  return connect()
    .then(conn => {
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

export function updateDocInDB(subDoc, id, table) {
  //event.updated = new Date();
  //event.text = xss(event.text);
  return connect()
    .then(conn => {
      return r
        .table(table)
        .get(id).update(subDoc).run(conn)
        .then(response => {
          if (response.errors) {
            throw 'Document not found'
          }
          return response.replaced; //should be 1
        });
    });
}

export function deleteDocInDB(id, table) {
  return connect()
    .then(conn => {
      return r
        .table(table)
        .get(id).delete().run(conn)
        .then(response => {
          if (response.errors) {
            throw 'Document not found'
          }
          return response.deleted; //should be 1
        });
    });
}
