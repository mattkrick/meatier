import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updatePath } from 'redux-simple-router';

@connect(mapStateToProps)
export default class RequireAuth extends Component {
  static PropTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  componentWillMount () {
    const {isAuthenticated, dispatch} = this.props;
    console.log('auth:', isAuthenticated, dispatch);
    if (!isAuthenticated) {
      dispatch(updatePath('/login'))
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}
