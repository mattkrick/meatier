import r from 'rethinkdb';
import configFile from './rethink.config.js';

//let config.db = config.db || 'pulse';
const {tables, ...config} = configFile;


r.connect(config)
  .then(conn => {
    console.log(' [-] Database Setup');
    return createDbIfNotExists(conn)
      .then(() => Promise.all(tables.map((table) => recreateTableIfNotExists(conn, table))))
      //.then(() => Promise.all(tables.map((table) => createTableIfNotExists(conn, table))))
      .then(() => closeConnection(conn));
  });

function createDbIfNotExists(conn){
  return getDbList(conn)
    .then((list) => {
      if(list.indexOf(config.db) === -1) {
        return createDatabase(conn);
      } else {
        console.log(' [!] Database already exists:', config.db);
        return Promise.resolve(true);
      }
    });
}

function createTableIfNotExists(conn, table) {
  return getTableList(conn)
    .then((list) => {
      if(list.indexOf(table) === -1) {
        return createTable(conn, table);
      } else {
        console.log(' [!] Table already exists:', table);
        return Promise.resolve(true);
      }
    });
}

function recreateTableIfNotExists(conn, table) {
  return getTableList(conn)
    .then((list) => {
      if(list.indexOf(table) === -1) {
        return createTable(conn, table);
      } else {
        console.log(' [!] Table already exists:', table);
        return dropTable(conn,table)
          .then(() => {
            return createTable(conn,table)
          });
      }
    });
}


function getDbList(conn) {
  return r.dbList().run(conn);
}

function getTableList(conn) {
  return r.db(config.db).tableList().run(conn);
}

function createDatabase(conn) {
  console.log(' [+] Create Database:', config.db);
  return r.dbCreate(config.db).run(conn);
}

function createTable(conn, table) {
  console.log(' [+] Create Table:', table);
  return r.db(config.db).tableCreate(table).run(conn);
}

function dropTable(conn, table) {
  console.log(' [x] Drop Table:', table);
  return r.db(config.db).tableDrop(table).run(conn);
}

function closeConnection(conn) {
  console.log(' [x] Close connection!');
  return conn.close();
}

