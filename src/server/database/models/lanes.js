import thinky from './thinky';
import {Note} from './notes';

export const Lane = thinky.createModel("lanes", {});
Lane.ensureIndex("userId");

export async function addLaneDB(lane) {
  lane.createdAt = Date.now()
  try {
    await Lane.save(lane);
  } catch (e) {
    throw e;
  }
}

export async function updateLaneDB(inLane) {
  const {id, ...updates} = inLane;
  updates.updatedAt = Date.now();
  let lane;
  try {
    lane = await Lane.get(id);
  } catch (e) {
    throw e;
  }
  try {
    await lane.merge(updates).save()
  } catch (e) {
    throw e;
  }
}

export async function deleteLaneDB(id) {
  let laneToDelete;
  try {
    laneToDelete = await Lane.get(id);
  } catch (e) {
    throw e;
  }
  try {
    await laneToDelete.delete();
  } catch (e) {
    throw e;
  }
}
