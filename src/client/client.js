import {render} from 'react-dom';
import React from 'react';
import {syncReduxAndRouter} from 'redux-simple-router';
import makeReducer from '../universal/redux/makeReducer';
import createHistory from 'history/lib/createBrowserHistory';

const initialState = window.__INITIAL_STATE__ || {};
const history = createHistory();
const createStore = __PRODUCTION__ ? require('./createStore.prod.js') : require('./createStore.dev.js');
const Root = __PRODUCTION__ ? require('./Root.prod.js') : require('./Root.dev.js');
const store = createStore(makeReducer(), initialState);
syncReduxAndRouter(history, store);

/* Currently, this is pretty useless since the store.getReducer() doesn't exist.
 * That means we have to save the current reducer somewhere
 */
if (module.hot) {
  module.hot.accept('../universal/redux/makeReducer', () => {
    const nextRootReducer = require('../universal/redux/makeReducer')
    store.replaceReducer(nextRootReducer())
  })
}

render(<Root store={store} history={history}/>, document.getElementById('root'));

