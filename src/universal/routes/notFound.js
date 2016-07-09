import LandingContainer from 'universal/modules/landing/containers/Landing/LandingContainer';

export default {
  path: '*',
  component: LandingContainer,
  indexRoute: {
    component: require('react-router!universal/components/NotFound/NotFound')
  }
};
