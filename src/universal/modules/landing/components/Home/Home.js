import React, { Component, PropTypes } from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';
import Header from '../Header/Header';

@pureRender
export default class Home extends Component {
  render() {
    return (
      <div>
        <Header/>
        <h1>...Nothing here. Try the kanban already.</h1>
      </div>
    );
  }
}
