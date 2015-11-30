import {addNoteDB, deleteNoteDB, updateNoteDB} from '../database/models/notes';
import promisify from 'es6-promisify';
import {noteSchemaInsert, noteSchemaUpdate} from '../../universal/redux/ducks/notes';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

export async function addNote(data, callback) {

  const schemaError = validateNoteSchema(data);
  if (schemaError) {
    return callback(null, schemaError);
  }
  this.docQueue.add(data.id);
  try {
    await addNoteDB(data);
  } catch (e) {
    this.docQueue.delete(data.id);
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function updateNote(data, callback) {
  const schemaError = validateNoteSchema(data, true);
  if (schemaError) {
    callback(null,schemaError); //bypass the generic 'error' listener from socketcluster
    return;
  }
  this.docQueue.add(data.id);
  try {
    await updateNoteDB(data);
  } catch (e) {
    this.docQueue.delete(data.id);
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function deleteNote(payload, callback) {
  const {id} = payload;
  this.docQueue.add(id);
  try {
    await deleteNoteDB(id);
  } catch (e) {
    this.docQueue.delete(data.id);
    return callback(null, {_error: e.message})
  }
  callback();
}

function validateNoteSchema(note, isUpdate) {
  const schema = isUpdate? noteSchemaUpdate : noteSchemaInsert;
  const results = Joi.validate(note, schema, {abortEarly: false});
  const error = parsedJoiErrors(results.error);
  if (Object.keys(error).length) {
    error._error = 'Invalid note';
    return error;
  }
}
