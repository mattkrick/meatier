import React from 'react';

export default store => {
  return {
    component: 'div',
    childRoutes: [{
      path: '/',
      component: require('./../containers/App/AppContainer').default,
      indexRoute: {
        component: require('./../components/Home/Home').default
      },
      childRoutes: [
        require('./kanban').default(store),
        require('./login').default(store),
        require('./signup').default(store),
        require('./logout').default,
        require('./notFound').default,
      ]
    }]
  }
}
