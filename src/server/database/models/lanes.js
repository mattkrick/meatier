import thinky from './thinky';

const Lane = thinky.createModel("lanes", {});
Lane.ensureIndex("userId");

export async function addLaneDB(inLane) {
  const lane = Object.assign({}, inLane, {
    createdAt: Date.now()
  })
  try {
    await Lane.save(lane);
  } catch (e) {
    throw new Error(e);
  }
}

export async function deleteLaneDB(id) {
  let laneToDelete;
  try {
    laneToDelete = await Lane.get(id);
  } catch(e) {
    throw new Error('Document not found');
  }
  try {
    await laneToDelete.delete()
  } catch(e) {
    throw new Error(e);
  }
}
