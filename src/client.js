import {render} from 'react-dom';
import React from 'react';
import {Map, fromJS} from 'immutable';
import {ensureState} from 'redux-optimistic-ui';

const makeStore = __PRODUCTION__ ? require('./redux/makeStore.prod.js') : require('./redux/makeStore.dev.js');
const Root = require('./containers/Root/Root.js');
const {auth, routing, form} = window.__INITIAL_STATE__;

 /*Currently, 3rd party reducers are kept as plain JS objects (routing and form)
 Although confusing, I'm calling this a best practice because not every reducer
 will be written well enough to handle being transformed into an immutable*/
let initialState = Map([
  ['auth', fromJS(auth)],
  ['routing', routing],
  ['form', form]
]);

const store = makeStore(initialState);
render(<Root store={store}/>, document.getElementById('root'));
