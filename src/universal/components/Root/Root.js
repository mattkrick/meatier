import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route} from 'react-router';
import { createStore,compose, combineReducers } from 'redux';

import { Provider, connect } from 'react-redux';
import DevTools from '../../containers/DevTools';
import App from '../App/App';
import routes from '../../routes';

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <div>
          <Router history={this.props.history}>
            {routes}
          </Router>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
