import React from 'react';
import {Route, IndexRoute} from 'react-router';
import AppContainer from './containers/App/AppContainer';
import Home from './components/Home/Home';
import KanbanContainer from './containers/Kanban/KanbanContainer';
import AuthContainer from './containers/Auth/AuthContainer';
import NotFound from './components/NotFound/NotFound';
import RequireAuth from './containers/RequireAuth/RequireAuth';
import Logout from './components/Logout/Logout';
import LostPassword from './components/LostPassword/LostPassword';
import ResetEmailSent from './components/ResetEmailSent/ResetEmailSent';
import ResetPassword from './components/ResetPassword/ResetPassword';
import ResetPasswordSuccess from './components/ResetPasswordSuccess/ResetPasswordSuccess';
import VerifyEmailContainer from './containers/VerifyEmail/VerifyEmailContainer';

export default (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={Home}/>
    <Route path="kanban" component={RequireAuth}>
      <IndexRoute component={KanbanContainer}/>
    </Route>
    <Route path="logout" component={Logout}/>
    <Route path="login">
      <IndexRoute component={AuthContainer}/>
      <Route path="lost-password" component={LostPassword}/>
      <Route path="reset-email-sent" component={ResetEmailSent}/>
      <Route path="reset-password/:resetToken" component={ResetPassword}/>
      <Route path="reset-password-success" component={ResetPasswordSuccess}/>
      <Route path="verify-email/:verifiedToken" component={VerifyEmailContainer}/>
    </Route>
    <Route path="signup" component={AuthContainer}/>

    <Route path="*" component={NotFound} status={404}/>
  </Route>
);
