import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route} from 'react-router';
import { createStore,compose, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import routes from '../universal/routes/index';

export default class Root extends Component {
  render() {
    const {history, store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes(store)}/>
        </div>
      </Provider>
    );
  }
}
