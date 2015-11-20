import tableLookup from '../universal/redux/mamaDuck';
import Joi from 'joi';
import {addDocToDB, updateDocInDB, deleteDocInDB, readTable} from './database/databaseQueries';

export function handleAddDoc(payload, table, cb) {
  const schema = tableLookup[table] && tableLookup[table].schema.full;
  if (!schema) return cb('Cannot find schema on server');

  const schemaError = Joi.validate(payload, schema).error;
  if (schemaError) return cb(schemaError.message);
  delay(500)
    .then(() => addDocToDB(payload, table))
    .then(success => cb(null, success))
    .catch(dbError => cb(dbError));
}

export function handleUpdateDoc(payload, table, cb) {
  const schema = tableLookup[table] && tableLookup[table].schema.full;
  if (!schema) return cb('Cannot find schema on server');
  const schemaError = Joi.validate(payload, schema).error;
  if (schemaError) return cb(schemaError.message);
  const {id, ...subdoc} = payload;
  delay(500)
    .then(() => updateDocInDB(subdoc, id, table))
    .then(success => cb(null, success))
    .catch(dbError => cb(dbError));
}

export function handleDeleteDoc(payload, table, cb) {
  delay(500)
    .then(() => deleteDocInDB(payload.id, table))
    .then(success => cb(null, success))
    .catch(dbError => cb(dbError));
}


function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

export function handleLoadLanes(cb) {
  readTable('lanes')
    .then(data => {
      cb(null,data);
    })
    .catch(error => {
      cb(error);
    })
}
