import {addLaneDB, deleteLaneDB} from '../database/models/lanes';
import promisify from 'es6-promisify';
import {laneSchema} from '../../universal/redux/ducks/lanes';
import Joi from 'joi';
import {parsedJoiErrors} from '../../universal/utils/schema';

export async function addLane(data, callback) {
  this.docQueue.add(data.id);
  const schemaError = validateLaneSchema(data);
  if (schemaError) {
    return callback(schemaError);
  }
  try {
    await addLaneDB(data);
  } catch (e) {
    return callback(e.message)
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
    return callback(e.message)
  }
  callback();
}

function validateLaneSchema(lane) {
  const results = Joi.validate(lane, laneSchema, {abortEarly: false});
  const error = parsedJoiErrors(results.error);
  if (Object.keys(error).length) {
    error._error = 'Invalid lane';
    return error;
  }
}
