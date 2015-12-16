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
      require('./kanban').default(store),
      require('./login').default(store),
      require('./signup').default(store),
      require('./logout').default,
      require('./notFound').default(),
    ]
  }
}
