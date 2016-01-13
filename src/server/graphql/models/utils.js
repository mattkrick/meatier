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
