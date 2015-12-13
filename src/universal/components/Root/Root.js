import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {IndexRoute, Router, Route} from 'react-router';
import { createStore,compose, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import DevTools from '../../containers/DevTools';
import App from '../App/App';
import routes from '../../routes/index';

export default class Root extends Component {
  render() {
    const {history, store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes(store)}/>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
