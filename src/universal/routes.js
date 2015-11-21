import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AppContainer from './containers/App/AppContainer';
import Home from './components/Home/Home';
import KanbanContainer from './containers/Kanban/KanbanContainer'
import AuthContainer from './containers/Auth/AuthContainer';
import NotFound from './components/NotFound/NotFound'
import RequireAuth from './containers/RequireAuth/RequireAuth';
import Logout from './components/Logout/Logout';

export default (
  <Route path="/" component={AppContainer}>
    <IndexRoute component={Home}/>
    <Route path="/kanban" component={RequireAuth}>
      <IndexRoute component={KanbanContainer}/>
    </Route>
    <Route path="/logout" component={Logout}/>
    <Route path="/login" component={AuthContainer}/>
    <Route path="/signup" component={AuthContainer}/>
    <Route path="*" component={NotFound} status={404}/>
  </Route>
);
