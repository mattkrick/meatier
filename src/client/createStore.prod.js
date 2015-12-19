import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import optimisticMiddleware from '../universal/redux/middleware/optimisticMiddleware';

export default compose(applyMiddleware(optimisticMiddleware, thunkMiddleware))(createStore);
