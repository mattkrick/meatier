import thinky from '../src/server/database/models/thinky';
const {r} = thinky;

export default async function removeTestTable() {
  await r.table('users').delete()
  await r.getPool().drain();
}

