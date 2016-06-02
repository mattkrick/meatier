import {render} from 'react-dom';
import React from 'react';
import {AppContainer} from 'react-hot-loader';
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
render(
  <AppContainer>
    <Root store={store}/>
  </AppContainer>
  , document.getElementById('root'));

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', () => {
    const Root = require('./Root');
    render(
      <AppContainer>
        <Root store={store}/>
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
