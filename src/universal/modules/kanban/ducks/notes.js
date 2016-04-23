import {fromJS, Map as iMap, List as iList} from 'immutable';
import {ensureState} from 'redux-optimistic-ui';
import socketCluster from 'socketcluster-client';
import {prepareGraphQLParams} from '../../../utils/fetching';
import socketOptions from '../../../utils/socketOptions';

/*
 * Action types
 */
export const NOTES = 'notes'; // db table
export const NOTE = 'note'; // dnd
export const ADD_NOTE = 'ADD_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
const DRAG_NOTE = 'DRAG_NOTE';
const CLEAR_NOTES = 'CLEAR_NOTES'; // local state flush
const ADD_NOTE_SUCCESS = 'ADD_NOTE_SUCCESS';
const UPDATE_NOTE_SUCCESS = 'UPDATE_NOTE_SUCCESS';
const DELETE_NOTE_SUCCESS = 'DELETE_NOTE_SUCCESS';
const ADD_NOTE_ERROR = 'ADD_NOTE_ERROR';
const UPDATE_NOTE_ERROR = 'UPDATE_NOTE_ERROR';
const DELETE_NOTE_ERROR = 'DELETE_NOTE_ERROR';


/*
 * Reducer
 */
const initialState = iMap({
  synced: false,
  error: null,
  data: iList()
});

export function reducer(state = initialState, action) {
  /* eslint-disable no-case-declarations, no-redeclare */
  switch (action.type) {
    case ADD_NOTE:
      const {doc: addDoc} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').push(fromJS(addDoc))
      });
    case UPDATE_NOTE:
      const {doc: updateDoc} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').map(item => item.get('id') === updateDoc.id ? item.merge(updateDoc) : item)
      });
    case DELETE_NOTE:
      const {id} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').filter(item => item.get('id') !== id)
      });
    case CLEAR_NOTES:
      return initialState;
    case DRAG_NOTE:
      const {sourceId, ...updates} = action.payload;
      return state.merge({
        data: state.get('data').map(item => item.get('id') === sourceId ? item.merge(updates) : item)
      });
    case ADD_NOTE_SUCCESS:
    case UPDATE_NOTE_SUCCESS:
    case DELETE_NOTE_SUCCESS:
      return state.merge({
        synced: true,
        error: null
      });
    case ADD_NOTE_ERROR:
    case UPDATE_NOTE_ERROR:
    case DELETE_NOTE_ERROR:
      return state.merge({
        synced: true,
        error: action.error || 'Error'
      });
    default:
      return state;
  }
}

function getNewIndex(notes, payload) {
  // if the source is above the target, put it below, otherwise, put it above
  const {sourceId, sourceIndex, sourceLaneId, targetLaneId, targetIndex} = payload;
  let xfactor = 1;
  if ((targetLaneId === sourceLaneId && sourceIndex > targetIndex) || targetLaneId !== sourceLaneId) {
    xfactor = -1;
  }
  let minIndex = Infinity * xfactor;
  for (let i = 0; i < notes.length; i++) {
    const curNote = notes[i];
    if (curNote.id === sourceId) {
      continue;
    }
    if (xfactor * curNote.index > xfactor * targetIndex && xfactor * curNote.index < xfactor * minIndex) {
      minIndex = curNote.index;
    }
  }
  return (minIndex === Infinity * xfactor) ? targetIndex + xfactor : (targetIndex + minIndex) / 2;
}

/*
 *Action creators
 */
const baseMeta = {
  table: NOTES,
  isOptimistic: true,
  synced: false
};

export function loadNotes() {
  const query = `
  subscription {
    getAllNotes {
      id,
      title,
      laneId,
      userId,
      index
    }
  }`;
  const serializedParams = prepareGraphQLParams({query});
  const sub = 'getAllNotes';
  const socket = socketCluster.connect(socketOptions);
  socket.subscribe(serializedParams, {waitForAuth: true});
  return dispatch => {
    // client-side changefeed handler
    socket.on(sub, data => {
      const meta = {synced: true};
      if (!data.old_val) {
        dispatch(addNote(data.new_val, meta));
      } else if (!data.new_val) { // eslint-disable-line no-negated-condition
        dispatch(deleteNote(data.old_val.id, meta));
      } else {
        dispatch(updateNote(data.new_val, meta));
      }
    });
    socket.on('unsubscribe', channelName => {
      if (channelName === sub) {
        dispatch({type: CLEAR_NOTES});
      }
    });
  };
}

export function addNote(doc, meta) {
  const query = `
  mutation($doc: NewNote!){
     payload: addNote(note: $doc) {
      id
    }
  }`;
  return {
    type: ADD_NOTE,
    payload: {
      query,
      variables: {doc}
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function updateNote(doc, meta) {
  const query = `
  mutation($doc: UpdatedNote!){
     payload: updateNote(note: $doc) {
      id
    }
  }`;
  return {
    type: UPDATE_NOTE,
    payload: {
      query,
      variables: {doc}
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function deleteNote(id, meta) {
  const query = `
  mutation($id: ID!) {
     payload: deleteNote(id: $id)
  }`;
  return {
    type: DELETE_NOTE,
    payload: {
      query,
      variables: {id}
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function dragNote(data) {
  return function (dispatch, getState) {
    const notes = ensureState(getState()).getIn(['notes', 'data']).toJS();
    const index = getNewIndex(notes, data);
    const updates = {index, laneId: data.targetLaneId};
    const payload = Object.assign({}, updates, {sourceId: data.sourceId});
    Object.assign(data.monitor.getItem(), updates);
    dispatch({type: DRAG_NOTE, payload});
  };
}

export const noteActions = {
  addNote,
  updateNote,
  deleteNote,
  dragNote
};
