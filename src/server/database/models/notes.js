import thinky from './thinky';

const Note = thinky.createModel("notes", {});
Note.ensureIndex("laneId");

export async function addNoteDB(note) {
  note.createdAt = Date.now()
  try {
    await Note.save(note);
  } catch (e) {
    throw new Error(e);
  }
}

export async function updateNoteDB(inNote) {
  const {id, ...updates} = inNote;
  console.log('NOTE', id, inNote);
  updates.updatedAt = Date.now();
  let note;
  try {
    note = await Note.get(id);
  } catch (e) {
    throw new Error('Document not found');
  }
  try {
    await note.merge(updates).save()
  } catch (e) {
    throw new Error(e);
  }
}

export async function deleteNoteDB(id) {
  let noteToDelete;
  try {
    noteToDelete = await Note.get(id);
  } catch (e) {
    throw new Error('Document not found');
  }
  try {
    await noteToDelete.delete()
  } catch (e) {
    throw new Error(e);
  }
}
