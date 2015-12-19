import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';
import createLogger from 'redux-logger';
import DevTools from './DevTools';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true
});

export default compose(applyMiddleware(optimisticMiddleware, thunkMiddleware, loggerMiddleware),
  DevTools.instrument())(createStore);
