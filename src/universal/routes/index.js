import React from 'react';
import AppContainer from './../containers/App/AppContainer';
import Home from './../components/Home/Home';

export default store => {
  return {
    path: '/',
    component: AppContainer,
    indexRoute: {
      component: Home
    },
    childRoutes: [
      require('./verifyEmail'),
      require('./kanban')(store),
      require('./login')(store),
      require('./signup')(store),
      require('./logout'),
      require('./notFound'),
    ]
  }
}
