import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../universal/routes/index';

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }
  render() {
    const {store} = this.props;
    return (
      <Provider store={store}>
        <div>
          <Router history={browserHistory} routes={routes(store)}/>
        </div>
      </Provider>
    );
  }
}
