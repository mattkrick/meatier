import {GraphQLNonNull} from 'graphql';

export const defaultResolveFn = (source, args, {fieldName}) => {
  const property = source[fieldName];
  return typeof property === 'function' ? property.call(source) : property;
};

export function resolveForAdmin(source, args, authToken) {
  return authToken && authToken.isAdmin ? defaultResolveFn.apply(this, arguments) : null;
}

export const errorObj = obj => {
  // Stringify an object to handle multiple errors
  // Wrap it in a new Error type to avoid sending it twice via the originalError field
  return new Error(JSON.stringify(obj));
};

// Showing a GraphQL error to the client is ugly
export const prepareClientError = res => {
  const {errors, data} = res;
  if (!errors) {
    return res;
  }
  const error = errors[0].message;
  if (error.indexOf('{"_error"') === -1) {
    console.log('DEBUG GraphQL Error:', error);
    return {data, error: JSON.stringify({_error: 'Server error while querying data'})};
  }
  return {data, error};
};

// if the add & update schemas have different required fields, use this
export const makeRequired = (fields, requiredFieldNames) => {
  const newFields = Object.assign({}, fields);
  requiredFieldNames.forEach(name => {
    newFields[name] = Object.assign({}, newFields[name], {type: new GraphQLNonNull(newFields[name].type)});
  });
  return newFields;
};

export function getFields(context, asts = context.fieldASTs) {
  // for recursion...Fragments doesn't have many sets...
  if (!Array.isArray(asts)) {
    asts = [asts];
  }

  // get all selectionSets
  const selections = asts.reduce((selections, source) => {
    selections.push(...source.selectionSet.selections);
    return selections;
  }, []);

  // return fields
  return selections.reduce((list, ast) => {
    switch (ast.kind) {
      case 'Field' :
        list[ast.name.value] = true;
        return list;
      case 'InlineFragment':
        return {
          ...list,
          ...getFields(context, ast)
        };
      case 'FragmentSpread':
        return {
          ...list,
          ...getFields(context, context.fragments[ast.name.value])
        };
      default:
        throw new Error('Unsuported query selection');
    }
  }, {});
}
