import {requireNoAuth} from './requireNoAuth';

export default {
  onEnter: requireNoAuth,
  path: 'signup',
  component: require('react-router!universal/modules/auth/containers/Auth/AuthContainer')
};
