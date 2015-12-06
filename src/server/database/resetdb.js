import config from './rethink.config.js';
import rethinkdb from 'rethinkdbdash';

const r = rethinkdb({
  pool: false,
  cursor: true
});

export default async function resetdb(debug) {
  const conn = await r.connect(config);
  const tableCursor = await r.db(config.db).tableList().run(conn);
  const tables = await tableCursor.toArray();
  if (!tables.length) {
    debug && console.log(' [X] No tables to drop');
    return conn.close();
  }
  for (let table of tables) {
    await r.db(config.db).tableDrop(table).run(conn);
    debug && console.log(' [X] Table dropped:', table);
  }
  debug && console.log(' [X] Success! Closing connection');
  conn.close();
}
