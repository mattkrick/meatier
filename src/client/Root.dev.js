import React, {Component} from 'react';
import {Router} from 'react-router';
import {Provider} from 'react-redux';
import DevTools from './DevTools';
import routes from '../universal/routes/index';
export default class Root extends Component {
  render() {
    const {browserHistory, store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory} routes={routes(store)}/>
          <DevTools/>
        </div>
      </Provider>
    );
  }
}
