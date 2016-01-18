import {GraphQLScalarType} from 'graphql';
import {GraphQLError} from 'graphql/error';
import {Kind} from 'graphql/language';

import {GraphQLURLType as _GraphQLURLType} from 'graphql-type-factory';
export const GraphQLURLType = _GraphQLURLType;

export const GraphQLEmailType = new GraphQLScalarType({
  name: 'Email',
  serialize: value => value.toLowerCase(),
  parseValue: value => value.toLowerCase(),
  parseLiteral: ast => {
    const re = /.+@.+/;
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Email is not a string, it is a: ' + ast.kind, [ast]);
    }
    if(!re.test(ast.value)) {
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
    console.log('KIND', ast.kind)
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError('Query error: Password is not a string, it is a: ' + ast.kind, [ast]);
    }
    if (ast.value.length < 6) {
      throw new GraphQLError(`Query error: Password must have a minimum length of 4.`, [ast]);
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
      throw new GraphQLError('Query error: Title is not a string, it is a: ' + ast.kind, [ast]);
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
