import React, {Component, PropTypes} from 'react';

// Injects the server rendered state and app into a basic html template
export default class Html extends Component {
  //static propTypes: {
  //  store: PropTypes.object.isRequired,
  //  title: PropTypes.string.isRequired
  //};

  render() {
    //const {title, store} = this.props;
    //const initialState = 'window.__INITIAL_STATE__ = ' + JSON.stringify(store.getState());
    return (
      <div>hi</div>
    );
    //<head>
      //<title>{title}</title>
    //</head>
    //<body>
    //<div id="root">
    //  </div>
    //  </body>
      //<script src="/static/app.js"/>
      //<script dangerouslySetInnerHTML={{__html: initialState}}/>
      //{process.env.NODE_ENV === 'production' ? <script src="/static/vendor.js"/> : null}
  }
}
