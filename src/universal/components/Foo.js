import React, {Component, PropTypes} from 'react';
export default class Html extends Component {

  render() {
    console.log('FOO DEBUG PROPS', this.props.children);
    return(
      <div>
        {JSON.stringify(this.props)}
    </div>
    )
  }
}
