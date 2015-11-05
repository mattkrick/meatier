import rootSchema from '../universal/redux/schemas.js';
import Joi from 'joi';
import {addDocToDB, updateDocInDB, deleteDocInDB} from './databaseQueries';

export function handleAddDoc(payload, table, cb) {
  const schema = rootSchema[table];
  if (!schema) return cb('Cannot find schema on server');

  const schemaError = Joi.validate(payload, schema).error;
  if (schemaError) return cb(schemaError.message);
  delay(500)
    .then(() => addDocToDB(payload, table))
    .then(success => cb(null, success))
    .catch(dbError => cb(dbError));
}

export function handleUpdateDoc(payload, table, cb) {
  const schema = rootSchema[table];
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
  const schema = rootSchema[table];
  if (!schema) return cb('Invalid table passed to server');
  delay(500)
    .then(() => deleteDocInDB(payload.id, table))
    .then(success => cb(null, success))
    .catch(dbError => cb(dbError));
}


function delay(ms) {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, ms);
  });
}
