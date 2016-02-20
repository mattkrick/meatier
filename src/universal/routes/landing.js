import Home from 'universal/modules/landing/components/Home/Home';
import LandingContainer from 'universal/modules/landing/containers/Landing/LandingContainer';

export default {
  path: '/',
  component: LandingContainer,
  indexRoute: {
    component: Home
  },
  childRoutes: []
};
