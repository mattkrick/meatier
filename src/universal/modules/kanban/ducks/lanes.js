import socketCluster from 'socketcluster-client';
import {fromJS, Map as iMap, List as iList} from 'immutable';
import {ensureState} from 'redux-optimistic-ui';
import socketOptions from '../../../utils/socketOptions';
import {prepareGraphQLParams} from '../../../utils/fetching';
import {deleteNote} from './notes';

/*
 * Action types
 */
export const LANES = 'lanes'; // db table
export const ADD_LANE = 'ADD_LANE';
export const UPDATE_LANE = 'UPDATE_LANE';
export const DELETE_LANE = 'DELETE_LANE';
const CLEAR_LANES = 'CLEAR_LANES'; // local state flush
const ADD_LANE_SUCCESS = 'ADD_LANE_SUCCESS';
const UPDATE_LANE_SUCCESS = 'UPDATE_LANE_SUCCESS';
const DELETE_LANE_SUCCESS = 'DELETE_LANE_SUCCESS';
const ADD_LANE_ERROR = 'ADD_LANE_ERROR';
const UPDATE_LANE_ERROR = 'UPDATE_LANE_ERROR';
const DELETE_LANE_ERROR = 'DELETE_LANE_ERROR';


/*
 * Reducer
 * For tables, I always keep these 3 fields.
 * If synced is false, it means what you see is optimistic, not from the db
 * If there is an error, then you can use that in the UI somewhere
 */
const initialState = iMap({
  synced: false,
  error: null,
  data: iList()
});

export function reducer(state = initialState, action) {
  /* eslint-disable no-case-declarations, no-redeclare */
  switch (action.type) {
    case ADD_LANE:
      const {doc: addDoc} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').push(fromJS(addDoc))
      });
    case UPDATE_LANE:
      const {doc: updateDoc} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').map(item => item.get('id') === updateDoc.id ? item.merge(updateDoc) : item)
      });

    case DELETE_LANE:
      const {id} = action.payload.variables;
      return state.merge({
        synced: action.meta && action.meta.synced || false,
        data: state.get('data').filter(item => item.get('id') !== id)
      });
    case CLEAR_LANES:
      return initialState;

    case ADD_LANE_SUCCESS:
    case UPDATE_LANE_SUCCESS:
    case DELETE_LANE_SUCCESS:
      return state.merge({
        synced: true,
        error: null
      });

    case ADD_LANE_ERROR:
    case UPDATE_LANE_ERROR:
    case DELETE_LANE_ERROR:
      return state.merge({
        synced: true,
        error: action.error || 'Error'
      });

    default:
      return state;
  }
}

/*
 * Action creators
 * Actions are pure JS objects, save the immutable stuff for the store
 */
const baseMeta = {
  table: LANES,
  isOptimistic: true,
  synced: false,
  isChild: false
};

export function loadLanes() {
  const query = `
  subscription {
    getAllLanes {
      id,
      userId,
      title
    }
  }`;
  const serializedParams = prepareGraphQLParams({query});
  const sub = 'getAllLanes';
  const socket = socketCluster.connect(socketOptions);
  socket.subscribe(serializedParams, {waitForAuth: true});
  return dispatch => {
    // client-side changefeed handler
    socket.on(sub, data => {
      const meta = {synced: true};
      if (!data.old_val) {
        dispatch(addLane(data.new_val, meta));
      } else if (!data.new_val) { // eslint-disable-line no-negated-condition
        dispatch(deleteLane(data.old_val.id, meta));
      } else {
        dispatch(updateLane(data.new_val, meta));
      }
    });
    socket.on('unsubscribe', channelName => {
      if (channelName === sub) {
        dispatch({type: CLEAR_LANES});
      }
    });
  };
}

export function addLane(doc, meta) {
  const query = `
  mutation($doc: NewLane!){
     payload: addLane(lane: $doc) {
      id
    }
  }`;
  return {
    type: ADD_LANE,
    payload: {
      query,
      variables: {doc}
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function updateLane(doc, meta) {
  const query = `
  mutation($doc: UpdatedLane!){
     payload: updateLane(lane: $doc) {
      id
    }
  }`;
  return {
    type: UPDATE_LANE,
    payload: {
      query,
      variables: {doc}
    },
    meta: Object.assign({}, baseMeta, meta)
  };
}

export function deleteLane(id, meta) {
  const query = `
  mutation($id: ID!) {
     payload: deleteLane(id: $id)
  }`;
  return (dispatch, getState) => {
    const noteState = ensureState(getState()).get('notes').toJS();
    if (noteState && noteState.data) {
      noteState.data.forEach(note => {
        if (note.laneId === id) {
          dispatch(deleteNote(note.id));
        }
      });
    }
    dispatch({
      type: DELETE_LANE,
      payload: {
        query,
        variables: {id}
      },
      meta: Object.assign({}, baseMeta, meta)
    });
  };
}

export const laneActions = {
  addLane,
  updateLane,
  deleteLane
};
