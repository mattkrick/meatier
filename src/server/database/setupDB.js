import r from './rethinkdriver';

const database = [
  {name: 'users', indices: ['email']},
  {name: 'lanes', indices: ['userId']},
  {name: 'notes', indices: ['laneId']}
];

export default async function setupDB() {
  let indices = [];
  const tables = await r.tableList().run();
  await Promise.all(tables.map(table => r.tableDrop(table)));
  await Promise.all(database.map(table => r.tableCreate(table.name)));
  database.forEach(table => table.indices.forEach(index => indices.push(r.table(table.name).indexCreate(index))));
  await Promise.all(indices);
  await r.getPool().drain();
}
