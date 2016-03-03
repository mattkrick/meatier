export function getGraphQLHost() {
  if (process && process.env && process.env.GRAPHQL_HOST) {
    return process.env.GRAPHQL_HOST || 'localhost';
  } else if (typeof(window) !== 'undefined') {
    return window && window.location && window.location.host || 'localhost';
  } else {
    return 'localhost';
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
