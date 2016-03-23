import {LOCATION_CHANGE} from 'react-router-redux';

const initialState = {locationBeforeTransitions: null};

// TODO: may be possible to hold this in an immutable Map in the state now
// export const routing = (state = initialState, {type, payload}) => {
//  switch (type) {
//    case LOCATION_CHANGE:
//      return state.set('locationBeforeTransitions', payload);
//    default:
//      return state
//  }
// }

export const routing = (state = initialState, {type, payload}) => {
  if (type === LOCATION_CHANGE) {
    return {...state, locationBeforeTransitions: payload};
  }
  return state;
};
