import {findInState} from './helpers.js';
import {addDoc, updateDoc, deleteDoc} from './ducks/docs.js';


export default function handleChangefeed(store, table, changedDocs) {
  const state = store.getState();
  //const {stateKey, addLocally, deleteLocally, updateLocally} = changefeedHandler[changeType];
  const {data} = state[table];
  const {newVal, oldVal} = changedDocs;
  if (!newVal) {
    //we know a lane was deleted, but did you do it?
    const localIdx = findInState(data, oldVal.id);
    if (localIdx !== -1){
      //if it's in our local data, someone else did it!
      store.dispatch(deleteDoc(oldVal.id));
      return;
    }
    //if it's not in our local data, we deleted it & we already executed a success action
  }
  const localIdx = findInState(data, newVal.id);
  const action = {
    payload: newVal,
    meta: {synced: true}
  };

  if (!oldVal) {
    //something was added! but did you do it?
    if (localIdx === -1) {
      //it's not found locally, someone else did it
      store.dispatch(addDoc(action));
    }
  } else {
    if (!deepEqual(newVal, data[localIdx])) {
      //someone else did it
      store.dispatch(updateDoc(action));
    }
  }
}

