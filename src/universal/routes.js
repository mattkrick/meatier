import React from 'react';
import {IndexRoute, Route} from 'react-router';
import KanbanContainer from './containers/KanbanContainer.js';
import NotFound from './components/NotFound.js';
import Home from './components/Home.js';

//import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
//import {
//    App,
//    Chat,
//    Home,
//    Widgets,
//    About,
//    Login,
//    LoginSuccess,
//    Survey,
//    NotFound,
//  } from 'containers';

//export default (store) => {
//const requireLogin = (nextState, replaceState, cb) => {
//  function checkAuth() {
//    const { auth: { user }} = store.getState();
//    if (!user) {
//      // oops, not logged in, so can't be here!
//      replaceState(null, '/');
//    }
//    cb();
//  }
//
//  if (!isAuthLoaded(store.getState())) {
//    store.dispatch(loadAuth()).then(checkAuth);
//  } else {
//    checkAuth();
//  }
//};

/**
 * Please keep routes in alphabetical order
 */
export default (store) => {
  //console.log('kanban', Kanban);
  return (
    <Route path="/" component={KanbanContainer}>
      <IndexRoute component={Home}/>
      <Route path="*" component={NotFound} status={404}/>
    </Route>
  )

};
//};
//<IndexRoute component={Kanban}/>
//{ /* Routes requiring login */ }
//<Route onEnter={requireLogin}>
//  <Route path="chat" component={Chat}/>
//  <Route path="loginSuccess" component={LoginSuccess}/>
//</Route>
//
//{ /* Routes */ }
//<Route path="about" component={About}/>
//<Route path="login" component={Login}/>
//  <Route path="survey" component={Survey}/>
//  <Route path="widgets" component={Widgets}/>
//
//  { /* Catch all route */ }
//<Route path="*" component={NotFound} status={404} />
