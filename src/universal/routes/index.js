import AppContainer from 'universal/containers/App/AppContainer';

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
  };
};
