import createHistory from '../../node_modules/history/lib/createMemoryHistory';
import React from 'react';
import {renderToString} from '../../node_modules/react-dom/server';
import {createStore} from 'redux';
import rootReducer from '../universal/redux/reducer.js';
import Html from './Html.js';

export default function createSSR(req, res) {
  const initialState = {};
  const store = createStore(rootReducer, initialState);
  // TODO: handle production webpack script & prerendering
  hydrateOnClient(store);

  function hydrateOnClient(store) {
    res.send('<!doctype html>\n' + renderToString(<Html title="Quack Quack" store={store}/>));
  }
}

