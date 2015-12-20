// https://github.com/webpack/webpack/tree/master/examples/code-splitted-require.context
//There's a lot of boilerplate here, but if the require isn't static, then webpack can't chunk properly
import {requireNoAuth} from './utils';
import {resolvePromiseMap} from '../utils/promises';

import makeReducer from '../redux/makeReducer';

export default store => {
  return {
    onEnter: requireNoAuth(store),
    path: 'login',
    getIndexRoute: async (location, cb) => {
      let component = await System.import('universal/containers/Auth/AuthContainer');
      cb(null, {component})
    },
    getChildRoutes: (location, cb) => {
      cb(null, [
        {
          path: 'lost-password',
          getComponent: async (location, cb) => {
            let component = await System.import('universal/components/LostPassword/LostPassword');
            cb(null, component)
          }
        },
        {
          path: 'reset-email-sent',
          getComponent: async (location, cb) => {
            let component = await System.import('universal/components/ResetEmailSent/ResetEmailSent');
            cb(null, component)
          }
        },
        {
          path: 'reset-password/:resetToken',
          getComponent: async (location, cb) => {
            let component = await System.import('universal/components/ResetPassword/ResetPassword');
            cb(null, component)
          }
        },
        {
          path: 'reset-password-success',
          getComponent: async (location, cb) => {
            let component = await System.import('universal/components/ResetPasswordSuccess/ResetPasswordSuccess');
            cb(null, component)
          }
        }
      ])
    }
  }
}
