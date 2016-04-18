import {GraphQLScalarType} from 'graphql';
import {GraphQLError} from 'graphql/error';
import {Kind} from 'graphql/language';

export const GraphQLEmailType = new GraphQLScalarType({
  name: 'Email',
  serialize: value => value.toLowerCase(),
  parseValue: value => value.toLowerCase(),
  parseLiteral: ast => {
    const re = /.+@.+/;
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Email is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (!re.test(ast.value)) {
      throw new GraphQLError('Query error: Not a valid Email', [ast]);
    }
    if (ast.value.length < 4) {
      throw new GraphQLError(`Query error: Email must have a minimum length of 4.`, [ast]);
    }
    if (ast.value.length > 300) {
      throw new GraphQLError(`Query error: Email is too long.`, [ast]);
    }
    return ast.value.toLowerCase();
  }
});

export const GraphQLPasswordType = new GraphQLScalarType({
  name: 'Password',
  serialize: value => String(value),
  parseValue: value => String(value),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Password is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (ast.value.length < 6) {
      throw new GraphQLError(`Query error: Password must have a minimum length of 6.`, [ast]);
    }
    if (ast.value.length > 60) {
      throw new GraphQLError(`Query error: Password is too long.`, [ast]);
    }
    return String(ast.value);
  }
});

export const GraphQLTitleType = new GraphQLScalarType({
  name: 'Title',
  serialize: value => String(value),
  parseValue: value => String(value),
  parseLiteral: ast => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: Title is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (ast.value.length < 1) {
      throw new GraphQLError(`Query error: Title must have a minimum length of 1.`, [ast]);
    }
    if (ast.value.length > 30) {
      throw new GraphQLError(`Query error: Title is too long.`, [ast]);
    }
    return String(ast.value);
  }
});

export const GraphQLURLType = new GraphQLScalarType({
  name: 'URL',
  serialize: value => String(value),
  parseValue: value => String(value),
  parseLiteral: ast => {
    const re = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
    if (!re.test(ast.value)) {
      throw new GraphQLError('Query error: Not a valid URL', [ast]);
    }
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(`Query error: URL is not a string, it is a: ${ast.kind}`, [ast]);
    }
    if (ast.value.length < 1) {
      throw new GraphQLError(`Query error: URL must have a minimum length of 1.`, [ast]);
    }
    if (ast.value.length > 2083) {
      throw new GraphQLError(`Query error: URL is too long.`, [ast]);
    }
    return String(ast.value);
  }
});
