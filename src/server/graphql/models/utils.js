export const defaultResolveFn = (source, args, { fieldName }) => {
  var property = source[fieldName];
  return typeof property === 'function' ? property.call(source) : property;
};

export function resolveForAdmin(source, args, info) {
  return info.rootValue.authToken.isAdmin ? defaultResolveFn.apply(this, arguments) : null;
}

export const errorObj = (obj) => {
  // Stringify an object to handle multiple errors
  // Wrap it in a new Error type to avoid sending it twice via the originalError field
  return new Error(JSON.stringify(obj));
}

// Showing a GraphQL error to the client is ugly
export const prepareClientError = res => {
  const {errors, data} = res;
  if (!errors) {
    return res;
  }
  const error = errors[0].message;
  const clientError = (error.indexOf('{_error') === -1) ? JSON.stringify({_error: 'Server error while fetching data'}) : error;
  return {data, error: clientError};
}
