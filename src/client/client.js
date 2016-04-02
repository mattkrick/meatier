import {render} from 'react-dom';
import React from 'react';
import {Map as iMap, fromJS} from 'immutable';
import makeStore from './makeStore';
import Root from './Root';

const {auth, routing, form} = window.__INITIAL_STATE__;

// form & routing are currently regular JS objects. This may change in the future
const initialState = iMap([
  ['auth', fromJS(auth)],
  ['routing', routing],
  ['form', form]
]);

const store = makeStore(initialState);
render(<Root store={store}/>, document.getElementById('root'));
