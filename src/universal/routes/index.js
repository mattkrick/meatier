import React from 'react';
import AppContainer from './../containers/App/AppContainer';
import LandingContainer from '../modules/Landing/containers/Landing/LandingContainer';
import Home from '../modules/Landing/components/Home/Home';
import {Route, IndexRoute, IndexRedirect} from 'react-router';

export default store => {
  return {
    component: AppContainer,
    childRoutes: [
      require('./landing'),
      require('./kanban')(store),
      require('./accounts')(store),
      require('./graphql'),
      require('./notFound')
    ]
  }
}
