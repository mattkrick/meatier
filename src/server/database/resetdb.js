import config from './rethink.config.js';
import rethinkdb from 'rethinkdbdash';

const r = rethinkdb({
  pool: false,
  cursor: true
});

async function resetdb() {
  const conn = await r.connect(config);
  const tableCursor = await r.db(config.db).tableList().run(conn);
  const tables = await tableCursor.toArray();
  if (!tables.length) {
    console.log(' [X] No tables to drop');
    return conn.close();
  }
  for (let table of tables) {
    await r.db(config.db).tableDrop(table).run(conn);
    console.log(' [X] Table dropped:', table);
  }
  console.log(' [X] Success! Closing connection');
  conn.close();
}
resetdb();
