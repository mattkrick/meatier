import r from './rethinkdriver';

// ava is the test database
const databases = ['meatier', 'ava'];

const database = [
  {name: 'users', indices: ['email']},
  {name: 'lanes', indices: ['userId']},
  {name: 'notes', indices: ['laneId']}
];

export default async function setupDB() {
  for (let db of databases) {
    try {
      await r.dbCreate(db);
    } catch (e) {
    }
    let indices = [];
    const tables = await r.db(db).tableList().run();
    await Promise.all(tables.map(table => r.db(db).tableDrop(table)));
    await Promise.all(database.map(table => r.db(db).tableCreate(table.name)));
    database.forEach(table => table.indices.forEach(index => indices.push(r.db(db).table(table.name).indexCreate(index))));
    await Promise.all(indices);
  }
  await r.getPool().drain();
}
