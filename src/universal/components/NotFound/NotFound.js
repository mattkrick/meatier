import React, {Component} from 'react';
import pureRender from 'universal/decorators/pureRender/pureRender';

@pureRender
export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h1>Pay attention to me!</h1>
      </div>
    );
  }
}
