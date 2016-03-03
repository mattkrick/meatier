export function getGraphQLHost() {
  if (process && process.env && process.env.GRAPHQL_HOST) {
    return process.env.GRAPHQL_HOST || 'localhost:3000';
  } else if (typeof(window) !== 'undefined') {
    return window && window.location && window.location.host || 'localhost:3000';
  } else {
    return 'localhost:3000';
  }
}

export function getGraphQLProtocol() {
  if (process && process.env && process.env.GRAPHQL_PROTOCOL) {
    return process.env.GRAPHQL_PROTOCOL || 'http:';
  } else if (typeof(window) !== 'undefined') {
    return window && window.location && window.location.protocol || 'http:';
  } else {
    return 'http:';
  }
}
