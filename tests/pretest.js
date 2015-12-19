import thinky from '../src/server/database/models/thinky';
const {r} = thinky;

export default async function removeTestTable() {
  const tables = await r.tableList();
  const muts = tables.map(table => r.table(table).delete());
  await* muts;
  await r.getPool().drain();
}

