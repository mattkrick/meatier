import {requireAuth} from './requireNoAuth';
import makeReducer from '../redux/makeReducer';
import {resolvePromiseMap} from '../utils/promises';
import LandingContainer from '../modules/Landing/containers/Landing/LandingContainer';

export default function (store) {
  return {
    component: LandingContainer,
    childRoutes: [
      require('./login')(store),
      require('./signup')(store),
      require('./logout'),
      require('./verifyEmail'),
    ]
  }
}
