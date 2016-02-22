import LandingContainer from 'universal/containers/Landing/LandingContainer';

export default function (store) {
  return {
    component: LandingContainer,
    childRoutes: [
      require('./login')(store),
      require('./signup')(store),
      require('./logout'),
      require('./verifyEmail')
    ]
  };
}
