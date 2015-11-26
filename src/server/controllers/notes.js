import {addNoteDB, deleteNoteDB, updateNoteDB} from '../database/models/notes';
import promisify from 'es6-promisify';
import {noteSchemaInsert, noteSchemaUpdate} from '../../universal/redux/ducks/notes';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

export async function addNote(data, callback) {
  this.docQueue.add(data.id);
  const schemaError = validateNoteSchema(data);
  if (schemaError) {
    return callback(null, schemaError);
  }
  try {
    await addNoteDB(data);
  } catch (e) {
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function updateNote(data, callback) {
  this.docQueue.add(data.id);
  const schemaError = validateNoteSchema(data, true);
  if (schemaError) {
    callback(null,schemaError); //bypass the generic 'error' listener
    return;
  }
  try {
    await updateNoteDB(data);
  } catch (e) {
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function deleteNote(payload, callback) {
  console.log('deleting note');
  const {id} = payload;
  this.docQueue.add(id);
  try {
    await deleteNoteDB(id);
  } catch (e) {
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
