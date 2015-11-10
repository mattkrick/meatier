import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Route} from 'react-router';
import { createStore,compose, combineReducers } from 'redux';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState
} from 'redux-router';

import { Provider, connect } from 'react-redux';
import DevTools from '../../containers/DevTools';
import App from '../App/App';
import routes from '../../routes';

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <ReduxRouter>
            {routes}
          </ReduxRouter>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
