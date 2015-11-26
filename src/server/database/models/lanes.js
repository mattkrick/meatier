import thinky from './thinky';
import {Note} from './notes';

export const Lane = thinky.createModel("lanes", {});
//Lane.hasMany(Note, "notes", "id", "laneId");
Lane.ensureIndex("userId");

export async function addLaneDB(lane) {
  lane.createdAt = Date.now()
  try {
    await Lane.save(lane);
  } catch (e) {
    throw new Error(e);
  }
}

export async function updateLaneDB(inLane) {
  const {id, ...updates} = inLane;
  updates.updatedAt = Date.now();
  let lane;
  try {
    lane = await Lane.get(id);
  } catch (e) {
    throw new Error('Document not found');
  }
  try {
    await lane.merge(updates).save()
  } catch (e) {
    throw new Error(e);
  }
}

export async function deleteLaneDB(id) {
  let laneToDelete;
  try {
    laneToDelete = await Lane.get(id).getJoin({notes: true});
  } catch (e) {
    throw new Error('Document not found');
  }
  try {
    await laneToDelete.deleteAll({notes: true})
  } catch (e) {
    throw new Error(e);
  }
}

export async function deletePostDB(id) {
  let postToDelete;
  try {
    postToDelete = await Post.get(id);
  } catch (e) {
    throw new Error('Document not found');
  }
  try {
    await postToDelete.delete();
  } catch (e) {
    throw new Error(e);
  }
}
