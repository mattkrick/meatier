import React, {PropTypes, Component} from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import Landing from 'universal/modules/landing/components/Landing/Landing';
import {connect} from 'react-redux';
import {ensureState} from 'redux-optimistic-ui';

@pureRender
@connect(mapStateToProps)
export default class LandingContainer extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
  };

  render() {
    return <Landing {...this.props}/>
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: ensureState(state).getIn(['auth', 'isAuthenticated'])
  }
}
