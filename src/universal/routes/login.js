// https://github.com/webpack/webpack/tree/master/examples/code-splitted-require.context
// There's a lot of boilerplate here, but if the require isn't static, then webpack can't chunk properly
import {requireNoAuth} from './requireNoAuth';

export default store => {
  return {
    onEnter: requireNoAuth(store),
    path: 'login',
    indexRoute: {
      component: require('react-router!universal/modules/auth/containers/Auth/AuthContainer')
    },
    childRoutes: [
      {
        path: 'lost-password',
        component: require('react-router!universal/modules/auth/components/LostPassword/LostPassword')
      },
      {
        path: 'reset-email-sent',
        component: require('react-router!universal/modules/auth/components/ResetEmailSent/ResetEmailSent')
      },
      {
        path: 'reset-password/:resetToken',
        component: require('react-router!universal/modules/auth/components/ResetPassword/ResetPassword')
      },
      {
        path: 'reset-password-success',
        component: require('react-router!universal/modules/auth/components/ResetPasswordSuccess/ResetPasswordSuccess')
      }
    ]
  };
};
