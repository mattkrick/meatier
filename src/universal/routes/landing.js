import {requireAuth} from './requireNoAuth';
import makeReducer from '../redux/makeReducer';
import {resolvePromiseMap} from '../utils/promises';
import Home from '../modules/Landing/components/Home/Home';
import LandingContainer from '../modules/Landing/containers/Landing/LandingContainer';

export default {
  path: '/',
  component: LandingContainer,
  indexRoute: {
    component: Home
  },
  childRoutes: []
}
