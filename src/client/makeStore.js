import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import {syncHistory, routeReducer} from 'redux-simple-router'
import {browserHistory} from 'react-router';
import makeReducer from '../universal/redux/makeReducer';

const storeCreator = () =>
	window.devToolsExtension
		? window.devToolsExtension()(createStore)
		: createStore;

export default function (initialState) {
  const reduxRouterMiddleware = syncHistory(browserHistory)
  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    optimisticMiddleware,
    thunkMiddleware
  )(storeCreator);
  return createStoreWithMiddleware(makeReducer(), initialState);
}
