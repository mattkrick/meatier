import {addLaneDB, deleteLaneDB, updateLaneDB} from '../database/models/lanes';
import promisify from 'es6-promisify';
import {laneSchemaInsert, laneSchemaUpdate} from '../../universal/schemas/lanes';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

export async function addLane(data, callback) {
  const schemaError = validateLaneSchema(data);
  if (schemaError) {
    return callback(null, schemaError);
  }
  this.docQueue.add(data.id);
  try {
    await addLaneDB(data);
  } catch (e) {
    this.docQueue.delete(data.id);
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function updateLane(data, callback) {

  const schemaError = validateLaneSchema(data, true);
  if (schemaError) {
    callback(null, schemaError); //bypass the generic 'error' listener
    return;
  }
  this.docQueue.add(data.id);
  try {
    await updateLaneDB(data);
  } catch (e) {
    this.docQueue.delete(data.id);
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function deleteLane(payload, callback) {
  const {id} = payload;
  this.docQueue.add(id);
  try {
    await deleteLaneDB(id);
  } catch (e) {
    this.docQueue.delete(id);
    return callback(null, {_error: e.message})
  }
  callback();
}

function validateLaneSchema(lane, isUpdate) {
  const schema = isUpdate ? laneSchemaUpdate : laneSchemaInsert;
  const results = Joi.validate(lane, schema, {abortEarly: false});
  const error = parsedJoiErrors(results.error);
  if (Object.keys(error).length) {
    error._error = 'Invalid lane';
    return error;
  }
}
