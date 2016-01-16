//import thinky from './thinky';
//
////export const Note = thinky.createModel("notes", {});
////Note.ensureIndex("laneId");
//
//export async function addNoteDB(note) {
//  note.createdAt = Date.now()
//  try {
//    await Note.save(note);
//  } catch (e) {
//    throw e;
//  }
//}
//
//export async function updateNoteDB(inNote) {
//  const {id, ...updates} = inNote;
//  updates.updatedAt = Date.now();
//  let note;
//  try {
//    note = await Note.get(id);
//  } catch (e) {
//    throw e;
//  }
//  try {
//    await note.merge(updates).save()
//  } catch (e) {
//    throw e;
//  }
//}
//
//export async function deleteNoteDB(id) {
//  let noteToDelete;
//  try {
//    noteToDelete = await Note.get(id);
//  } catch (e) {
//    throw e;
//  }
//  try {
//    await noteToDelete.delete()
//  } catch (e) {
//    throw e;
//  }
//}
