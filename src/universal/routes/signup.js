import {requireNoAuth} from './requireNoAuth';
import makeReducer from '../redux/makeReducer';

export default store => {
  return {
    onEnter: requireNoAuth,
    path: 'signup',
    getComponent: async (location, cb) => {
      let component = await System.import('universal/containers/Auth/AuthContainer');
      cb(null, component)
    }
  }
}
