import Home from 'components/Home/Home';
import LandingContainer from 'containers/Landing/LandingContainer';

export default {
  path: '/',
  component: LandingContainer,
  indexRoute: {
    component: Home
  },
  childRoutes: []
}
