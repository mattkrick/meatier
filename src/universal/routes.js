import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App/App';
//import ContactPage from './components/ContactPage/ContactPage';
//import LoginPage from './components/LoginPage';
import KanbanContainer from './components/Kanban/KanbanContainer'
import NotFound from './components/NotFound/NotFound'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={KanbanContainer} />
    <Route path="/kanban" component={KanbanContainer}/>
    <Route path="*" component={NotFound} status={404}/>
  </Route>
);
    //<Route path="/login" component={ContactPage}/>
