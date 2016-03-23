import {ensureState} from 'redux-optimistic-ui';

export const requireNoAuth = store => (nextState, replace, cb) => {
  if (__CLIENT__) {
    const isAuthenticated = ensureState(store.getState()).getIn(['auth', 'isAuthenticated']);
    if (isAuthenticated) {
      replace({pathname: '/'});
    }
  }
  cb();
};
