import r from './rethinkdriver';

// ava is the test database
const databases = ['meatier', 'ava'];

const database = [
  {name: 'users', indices: ['email']},
  {name: 'lanes', indices: ['userId']},
  {name: 'notes', indices: ['laneId']}
];

export default async function setupDB(isUpdate = false) {
  await Promise.all(databases.map(db => ({db, isUpdate})).map(reset));
  await r.getPool().drain();
  console.log(`>>Database setup complete!`);
}

async function reset({db, isUpdate}) {
  const dbList = await r.dbList();
  if (dbList.indexOf(db) === -1) {
    console.log(`>>Creating Database: ${db}`);
    await r.dbCreate(db);
  }
  let tables = await r.db(db).tableList();
  if (!isUpdate) {
    console.log(`>>Dropping tables on: ${db}`);
    await Promise.all(tables.map(table => r.db(db).tableDrop(table)));
  }
  tables = await r.db(db).tableList();
  console.log(`>>Creating tables on: ${db}`);
  await Promise.all(database.map(table => {
    if (tables.indexOf(table.name) === -1) {
      return r.db(db).tableCreate(table.name);
    }
  }));
  console.log(`>>Adding table indices on: ${db}`);
  const indices = [];
  for (let table of database) {
    const indexList = await r.db(db).table(table.name).indexList();
    table.indices.forEach(index => {
      if (indexList.indexOf(index) === -1) {
        indices.push(r.db(db).table(table.name).indexCreate(index));
      }
    });
  }
  await Promise.all(indices);
  console.log(`>>Setup complete for: ${db}`);
}
