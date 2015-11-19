import r from 'rethinkdb';
import config, {tables} from './rethink.config.js';

r.connect(config)
  .then(conn => {
    console.log(' [-] Database Setup');
    return createDbIfNotExists(conn)
      .then(() => Promise.all(tables.map(table => recreateTable(conn, table))))
      .then(() => Promise.all(tables.map(table => indexTable(conn, table))))
      .then(() => closeConnection(conn));
  });

function createDbIfNotExists(conn) {
  return getDbList(conn)
    .then((list) => {
      if (list.indexOf(config.db) === -1) {
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
      if (list.indexOf(table) === -1) {
        return createTable(conn, table);
      } else {
        console.log(' [!] Table already exists:', table);
        return Promise.resolve(true);
      }
    });
}

function recreateTable(conn, table) {
  return getTableList(conn)
    .then((list) => {
      if (list.indexOf(table.name) === -1) {
        return createTable(conn, table);
      } else {
        console.log(' [!] Table already exists:', table);
        return dropTable(conn, table.name)
          .then(() => {
            return createTable(conn, table)
          });
      }
    });
}

function indexTable(conn, table) {
  if (table.index) {
    console.log(' [+] Creating index', table.index, 'on', table.name);
    return r.db(config.db).table(table.name).insert({foo:1}).run(conn);
  }
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
  console.log(' [+] Create Table:', table.name);
  return r.db(config.db).tableCreate(table.name).run(conn)
}

function dropTable(conn, tableName) {
  console.log(' [x] Drop Table:', tableName);
  return r.db(config.db).tableDrop(tableName).run(conn);
}

function closeConnection(conn) {
  console.log(' [x] Close connection!');
  return conn.close();
}
