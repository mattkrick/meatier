import {addDoc, updateDoc, deleteDoc} from './docs.js';
import uuid from 'node-uuid';
import Joi from 'joi';

export const LANES = 'lanes'; //rethinkdb table name

/*
* Schemas
*/
export const laneTextSchema = Joi.string().max(200).trim().required();
export const laneSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  text: laneTextSchema
});

/*
*Action creators
*/
const meta = {
  table: LANES,
  isOptimistic: true,
  synced: false
};

export function addLane() {
  return addDoc({
    payload: {
      id: uuid.v4(),
      text: 'New lane'
    },
    meta
  });
}

export function updateLane(id, text) {
  return updateDoc({
    payload: {
      id, text
    },
    meta
  });
}

export function deleteLane(id) {
  return deleteDoc({
    payload: {
      id
    },
    meta
  });
}

export const actions = {
  addLane,
  updateLane,
  deleteLane
};


