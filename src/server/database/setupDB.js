import r from './rethinkdriver';

// ava is the test database
const databases = ['meatier', 'ava'];

const database = [
  {name: 'users', indices: ['email']},
  {name: 'lanes', indices: ['userId']},
  {name: 'notes', indices: ['laneId']}
];

export default async function setupDB() {
  await Promise.all(databases.map(reset));
  await r.getPool().drain();
}

async function reset(db) {
  try {
    console.log('creating', db);
    await r.dbCreate(db);
  } catch (e) {
    console.log(e && e.message);
  }
  const indices = [];
  const tables = await r.db(db).tableList().run();
  console.log('dropping all tables on', db);
  await Promise.all(tables.map(table => r.db(db).tableDrop(table)));
  console.log('creating new tables on', db);
  await Promise.all(database.map(table => r.db(db).tableCreate(table.name)));
  console.log('adding indexes to tables on', db);
  database.forEach(table => table.indices.forEach(index => indices.push(r.db(db).table(table.name).indexCreate(index))));
  await Promise.all(indices);
  console.log('set up', db);
}
