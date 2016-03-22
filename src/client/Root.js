import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../universal/routes/index';
import {syncHistoryWithStore} from 'react-router-redux';
import {ensureState} from 'redux-optimistic-ui';

export default class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object.isRequired
  }

  render() {
    const {store} = this.props;
    const history = syncHistoryWithStore(browserHistory, store, {selectLocationState: state => ensureState(state).get('routing')});
    return (
      <Provider store={store}>
        <div>
          <Router history={history} routes={routes(store)}/>
        </div>
      </Provider>
    );
  }
}
