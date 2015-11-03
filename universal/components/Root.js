import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore, compose, combineReducers } from 'redux';
import {
  ReduxRouter,
  routerStateReducer,
  reduxReactRouter,
  pushState
} from 'redux-router';
import {IndexRoute, Route} from 'react-router';
import KanbanContainer from '../containers/KanbanContainer.js';
import NotFound from './NotFound.js';
import Home from './Home.js';
import { Provider, connect } from 'react-redux';

export default class Root extends Component {
  render() {
    return (
      <Provider store={this.props.store}>
        <ReduxRouter>
          <Route path="/" component={KanbanContainer}>
            <IndexRoute component={Home}/>
            <Route path="*" component={NotFound} status={404}/>
          </Route>
        </ReduxRouter>
      </Provider>
    );
  }
}


