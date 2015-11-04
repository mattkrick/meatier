import {addDoc, updateDoc, deleteDoc} from './docs.js';
import uuid from 'node-uuid';
import Joi from 'joi';

export const LANES = 'lanes'; //rethinkdb table name

export const laneSchema = Joi.object().keys({
  id: Joi.string().min(3).max(36).required(),
  text: Joi.string().max(200).required()
});

export function addLane() {
  return addDoc({
    payload: {
      id: uuid.v4(),
      text: 'New lane'
    },
    meta: {
      table: LANES,
      isOptimistic: true,
      synced: false
    }
  });
}

export function editLane(id, isEditing) {
  return {type: types.IS_EDITING_LANE, id, isEditing}
}

export const actions = {
  addLane
};


