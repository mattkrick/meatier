import {addLaneDB, deleteLaneDB, updateLaneDB} from '../database/models/lanes';
import promisify from 'es6-promisify';
import {laneSchemaInsert, laneSchemaUpdate} from '../../universal/redux/ducks/lanes';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

export async function addLane(data, callback) {
  this.docQueue.add(data.id);
  const schemaError = validateLaneSchema(data);
  if (schemaError) {
    return callback(null, schemaError);
  }
  try {
    await addLaneDB(data);
  } catch (e) {
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function updateLane(data, callback) {
  this.docQueue.add(data.id);
  const schemaError = validateLaneSchema(data, true);
  if (schemaError) {
    callback(null,schemaError); //bypass the generic 'error' listener
    return;
  }
  try {
    await updateLaneDB(data);
  } catch (e) {
    return callback(null, {_error: e.message})
  }
  callback();
}

export async function deleteLane(payload, callback) {
  console.log('deleting lane');
  const {id} = payload;
  this.docQueue.add(id);
  try {
    await deleteLaneDB(id);
  } catch (e) {
    return callback(null, {_error: e.message})
  }
  callback();
}

function validateLaneSchema(lane, isUpdate) {
  const schema = isUpdate? laneSchemaUpdate : laneSchemaInsert;
  const results = Joi.validate(lane, schema, {abortEarly: false});
  const zerror = parsedJoiErrors(results.error);
  if (Object.keys(zerror).length) {
    zerror._error = 'Invalid lane';
    return zerror;
  }
}
