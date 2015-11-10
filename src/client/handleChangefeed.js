import {findInState} from './../universal/redux/helpers.js';
import {addDoc, updateDoc, deleteDoc} from './../universal/redux/ducks/docs.js';
import deepEqual from 'deep-equal';
import lookup from '../universal/redux/mamaDuck';

export default function handleChangefeed(store, table, changedDocs) {
  const state = store.getState();
  const {data} = state[table];
  const {newVal, oldVal} = changedDocs;
  const {addDoc, updateDoc, deleteDoc} = lookup[table];
  if (!newVal) {
    //we know a doc was deleted, but did you do it?
    const localIdx = findInState(data, oldVal.id);
    if (localIdx !== -1) {
      //if it's in our local data, someone else did it!
      store.dispatch(deleteDoc(oldVal.id));
    }
    //if it's not in our local data, we deleted it & we already executed a success action
    return;
  }
  const localIdx = findInState(data, newVal.id);
  //const action = {
  //  payload: newVal,
  //  meta: {synced: true}
  //};
  const meta = {synced: true};
  if (!oldVal) {
    //something was added! but did you do it?
    if (localIdx === -1) {
      //it's not found locally, someone else did it
      store.dispatch(addDoc(newVal,meta));
    }
  } else {
    if (!deepEqual(newVal, data[localIdx])) {
      //someone else did it
      store.dispatch(updateDoc(newVal, meta));
    }
  }
}

