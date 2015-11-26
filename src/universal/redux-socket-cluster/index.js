import socketCluster from 'socketcluster-client';
import React, { Component,PropTypes } from 'react';
import promisify from 'es6-promisify';
import deepEqual from 'deep-equal';

// constants
const CONNECT_REQUEST = "@@socketCluster/CONNECT_REQUEST";
const CONNECT_SUCCESS = "@@socketCluster/CONNECT_SUCCESS";
const CONNECT_ERROR = "@@socketCluster/CONNECT_ERROR";
const AUTH_REQUEST = "@@socketCluster/AUTH_REQUEST";
const AUTH_SUCCESS = "@@socketCluster/AUTH_SUCCESS";
const AUTH_ERROR = "@@socketCluster/AUTH_ERROR";
const SUBSCRIBE_REQUEST = "@@socketCluster/SUBSCRIBE_REQUEST";
const SUBSCRIBE_SUCCESS = "@@socketCluster/SUBSCRIBE_SUCCESS";
const SUBSCRIBE_ERROR = "@@socketCluster/SUBSCRIBE_ERROR";
const KICKOUT = "@@socketCluster/KICKOUT";
const UNSUBSCRIBE = "@@socketCluster/UNSUBSCRIBE";
const DISCONNECT = "@@socketCluster/DISCONNECT";
const DEAUTHORIZE = "@@socketCluster/DEAUTHORIZE";

// Action creators
function disconnect() {
  return {
    type: DISCONNECT
  }
}

function deauthorize() {
  return {
    type: DEAUTHORIZE
  }
}
function connectRequest(payload) {
  return {
    type: CONNECT_REQUEST,
    payload
  }
}

function connectSuccess(payload) {
  return {
    type: CONNECT_SUCCESS,
    payload
  }
}

function connectError(error) {
  return {
    type: CONNECT_ERROR,
    error
  }
}

function authRequest() {
  return {
    type: AUTH_REQUEST
  }
}

function authSuccess(payload) {
  return {
    type: AUTH_SUCCESS,
    payload
  }
}

function authError(error) {
  return {
    type: AUTH_ERROR,
    error
  }
}

function subscribeRequest(payload) {
  return {
    type: SUBSCRIBE_REQUEST,
    payload
  }
}

function subscribeSuccess(payload) {
  return {
    type: SUBSCRIBE_SUCCESS,
    payload
  }
}

function subscribeError(payload, error) {
  return {
    type: SUBSCRIBE_ERROR,
    payload,
    error
  }
}

function subscribeKickout(error) {
  return {
    type: KICKOUT,
    error
  }
}

// Reducer
const initialState = {
  state: 'closed',
  id: null,
  isAuthenticated: false,
  isAuthenticating: false,
  lastError: null,
  token: null,
  connectionError: '',
  permissionError: '',
  tokenError: '',
  pendingSubs: [],
  subs: []

};

export const socketClusterReducer = function (state = initialState, action) {
  switch (action.type) {
    case DEAUTHORIZE:
      return Object.assign({}, state, {
        isAuthenticated: false,
        token: null
      });
    case DISCONNECT:
      return Object.assign({}, initialState)
    case CONNECT_REQUEST:
      return Object.assign({}, state, {
        state: 'connecting'
      });
    case CONNECT_ERROR:
      return Object.assign({}, state, {
        lastError: action.error
      });
    case CONNECT_SUCCESS:
      return Object.assign({}, state, {
        state: action.payload.state,
        id: action.payload.id,
        isAuthenticated: action.payload.isAuthenticated,
        lastError: action.payload.error
      });
    case AUTH_REQUEST:
      return Object.assign({}, state, {
        isAuthenticating: true
      });
    case AUTH_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: true,
        token: action.payload.token
      });
    case AUTH_ERROR:
      return Object.assign({}, state, {
        isAuthenticating: false,
        isAuthenticated: false,
        lastError: action.error
      });
    case SUBSCRIBE_REQUEST:
      return Object.assign({}, state, {
        pendingSubs: [...state.pendingSubs, action.payload.channelName]
      });
    case SUBSCRIBE_SUCCESS:
      return Object.assign({}, state, {
        pendingSubs: state.pendingSubs.filter(sub => sub !== action.payload.channelName),
        subs: [...state.subs, action.payload.channelName]
      });
    case SUBSCRIBE_ERROR:
      return Object.assign({}, state, {
        pendingSubs: state.pendingSubs.filter(sub => sub !== action.payload.channelName),
        lastError: action.error
      });
    case KICKOUT:
      return Object.assign({}, state, {
        lastError: action.error
      })
    case UNSUBSCRIBE:
      return Object.assign({}, state, {
        subs: state.subs.filter(sub => sub !== action.payload.channelName)
      })
    default:
      return state;
  }
}

// HOC
export const reduxSocket = (options, reduxSCOptions) => ComposedComponent => {
  return class SocketClustered extends Component {
    static contextTypes = {
      store: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
      super(props, context);
      options = options || {};
      this.clusteredOptions = Object.assign({
        keepAlive: 5000
      }, reduxSCOptions)
    }

    componentWillMount() {
      this.socket = socketCluster.connect(options);
      this.socket._callbacks = [];
      clearTimeout(this.socket.__destructionCountdown);
      this.authTokenName = options.authTokenName;
      this.handleConnection();
      this.handleError();
      this.handleSubs();
      this.handleAuth();
    }

    componentWillUnmount() {
      this.socket.__destructionCountdown = setTimeout(() => {
        this.socket.disconnect();
        this.socket._callbacks = [];
        this.socket = socketCluster.destroy(options);
      }, this.clusteredOptions.keepAlive)
    }

    render() {
      return (
        <ComposedComponent {...this.props}/>
      )
    }

    handleSubs() {
      const {dispatch} = this.context.store;
      const {socket} = this;
      socket.on('subscribeRequest', channelName => {
        dispatch(subscribeRequest({channelName}))
      })
      socket.on('subscribe', channelName => {
        dispatch(subscribeSuccess({channelName}))
      })
      socket.on('subscribeFail', (error, channelName) => {
        dispatch(subscribeError({channelName}, error))
      })
      //only sends a messsage to lastError, unsub does the rest
      socket.on('kickOut', (error, channelName) => {
        dispatch(subscribeKickout(error))
      })
      socket.on('unsubscribe', (channelName) => {
        dispatch(subscribeKickout({channelName}))
      })
    }

    handleConnection() {
      const {dispatch} = this.context.store;
      const {socket} = this;

      //handle case where socket was opened before the HOC
      if (socket.state !== 'open') {
        dispatch(connectRequest({state: socket.getState()}));
      } else if (!socket.__destructionCountdown) {
        dispatch(connectSuccess({
          id: socket.id,
          isAuthenticated: socket.isAuthenticated,
          state: socket.state
        }));
      }
      socket.on('connect', status => {
        dispatch(connectSuccess({
          id: status.id,
          isAuthenticated: status.isAuthenticated,
          state: 'open',
          error: status.authError
        }));
      });
      socket.on('disconnect', () => {
        dispatch(disconnect());
      });
      socket.on('connectAbort', () => { //triggers while in connecting state
        dispatch(disconnect());
      });
    }

    handleError() {
      const {dispatch} = this.context.store;
      const {socket} = this;
      socket.on('error', error => {
        dispatch(connectError({
          error: error.message
        }))
      })
    }

    async handleAuth() {
      const {dispatch} = this.context.store;
      const {socket, authTokenName} = this;
      socket.on('authenticate', token => {
        dispatch(authSuccess({token}));
      });
      socket.on('removeAuthToken', () => {
        dispatch(deauthorize());
      });
      if (authTokenName && socket.isAuthenticated !== true) {
        dispatch(authRequest());
        const loadToken = promisify(socket.auth.loadToken.bind(socket.auth));
        const authenticate = promisify(socket.authenticate.bind(socket));
        const token = await loadToken(authTokenName);
        const authStatus = await authenticate(token);
        if (authStatus.authError) {
          dispatch(authError(authStatus.authError.message));
        }
      }
    }
  }
}
