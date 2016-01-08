import {ensureState} from 'redux-optimistic-ui';

export function getFormState(state, reduxMountPoint) {
  return ensureState(state).get(reduxMountPoint);
}
