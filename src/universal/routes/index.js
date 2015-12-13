import React from 'react';

export default store => {
  return {
    component: 'div',
    childRoutes: [{
      path: '/',
      component: require('./../containers/App/AppContainer'),
      indexRoute: {
        component: require('./../components/Home/Home')
      },
      childRoutes: [
        require('./kanban')(store),
        require('./login')(store),
        require('./signup')(store),
        require('./logout'),
        require('./notFound'),
      ]
    }]
  }
}
