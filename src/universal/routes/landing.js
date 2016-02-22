import Home from 'universal/components/Home/Home';
import LandingContainer from 'universal/containers/Landing/LandingContainer';

export default {
  path: '/',
  component: LandingContainer,
  indexRoute: {
    component: Home
  },
  childRoutes: []
};
