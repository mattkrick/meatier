import createHistory from '../../node_modules/history/lib/createMemoryHistory';
import React from 'react';
import {renderToString} from '../../node_modules/react-dom/server';
import { createStore, compose } from 'redux';
import qs from 'query-string';
import rootReducer from '../universal/redux/reducer.js';
import Html from './Html.js';
import DevTools from '../universal/containers/DevTools';

export default function createSSR(req, res) {
  const initialState = {}; //edit this with an initial DB query
  const store = createStore(rootReducer, initialState);
  //TODO: handle production webpack script & prerendering
  hydrateOnClient(store);

  function hydrateOnClient(store) {
    res.send('<!doctype html>\n' + renderToString(<Html title='Quack Quack' store={store}/>));
  }
}

