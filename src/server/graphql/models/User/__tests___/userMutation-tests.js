import test from 'ava';
import promisify from 'es6-promisify';
import 'babel-register';
import 'babel-polyfill';
import validateSecretToken from '../../../../../universal/utils/validateSecretToken'
import bcrypt from 'bcrypt';
import {graphql} from 'graphql';
import Schema from '../../../rootSchema';
import r from '../../../../database/rethinkdriver';

const compare = promisify(bcrypt.compare);
const user = `
{
  id,
  email,
  createdAt,
  updatedAt,
  strategies {
    local {
      isVerified,
      password,
      verifiedEmailToken,
      resetToken
    },
    google {
      id,
      email,
      isVerified,
      name,
      firstName,
      lastName,
      picture,
      gender,
      locale
    }
  }
}`

const userWithAuthToken = `
{
  user ${user},
  authToken
}`

test('createUser:hashedPassword', async t => {
  t.plan(1);
  const query = `
  mutation {
    newUser: createUser(
      email: "createUser:hashedPassword@createUser:hashedPassword",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  const actual = await graphql(Schema, query);
  const {user:{id}} = actual.data.newUser;
  const user = await r.table('users').get(id);
  t.true(await compare('a123123', user.strategies.local.password))
});

test('createUser:caseInsensitive', async t => {
  t.plan(1);
  const query = `
  mutation {
    newUser: createUser(
      email: "createUser:caseInsensitive@createUser:caseInsensitive",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  const actual = await graphql(Schema, query);
  const {user:{id, email}} = actual.data.newUser;
  const user = await r.table('users').get(id);
  t.is(email, "createuser:caseinsensitive@createuser:caseinsensitive");

});

test('createUser:success', async t => {
  const query = `
  mutation {
    newUser: createUser(
      email: "createUser:success@createUser:success",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  t.plan(4);
  const actual = await graphql(Schema, query);
  const {user:{id, createdAt}, authToken} = actual.data.newUser;
  const expected = {
    "data": {
      "newUser": {
        "user": {
          "id": id,
          "email": "createuser:success@createuser:success",
          "createdAt": createdAt,
          "updatedAt": null,
          "strategies": {
            "local": {
              "isVerified": false,
              "password": null,
              "verifiedEmailToken": null,
              "resetToken": null
            },
            "google": null
          }
        },
        "authToken": authToken
      }
    }
  }
  t.true(new Date(createdAt) <= new Date());
  t.true(typeof id === 'string');
  t.ok(authToken);
  t.same(actual, expected)
});

test('createUser:alreadyexists', async t => {
  //treat it like a login
  const query = `
  mutation {
    newUser: createUser(
      email: "createUser:alreadyexists@createUser:alreadyexists",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  t.plan(4);
  const user1 = await graphql(Schema, query);
  const actual = await graphql(Schema, query);
  const {user:{id, createdAt}, authToken} = actual.data.newUser;
  const expected = {
    "data": {
      "newUser": {
        "user": {
          "id": id,
          "email": "createuser:alreadyexists@createuser:alreadyexists",
          "createdAt": createdAt,
          "updatedAt": null,
          "strategies": {
            "local": {
              "isVerified": false,
              "password": null,
              "verifiedEmailToken": null,
              "resetToken": null
            },
            "google": null
          }
        },
        "authToken": authToken
      }
    }
  }
  t.true(new Date(createdAt) <= new Date());
  t.true(typeof id === 'string');
  t.ok(authToken);
  t.same(actual, expected)
});

test('createUser:emailexistsdifferentpass', async t => {
  const query = `
  mutation {
    newUser: createUser(
      email: "createUser:emailexistsdifferentpass@createUser:emailexistsdifferentpass",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  t.plan(1);
  await graphql(Schema, query);
  const actual = await graphql(Schema, query.replace('a123123', 'b123123'));
  const expected = {
    "data": {
      "newUser": null
    },
    "errors": [
      {
        "message": "{\"_error\":\"Cannot create account\",\"email\":\"Email already exists\"}",
        "originalError": {}
      }
    ]
  }
  t.is(actual.errors[0].message, expected.errors[0].message)
});

test('emailPasswordReset:success', async t => {
  const createQuery = `
  mutation {
    newUser: createUser(
      email: "emailPasswordReset:success@emailPasswordReset:success",
      password: "a123123"
    )
    ${userWithAuthToken}
  }`
  const query = `
  mutation {
    newUser: emailPasswordReset(
      email: "emailPasswordReset:success@emailPasswordReset:success"
    )
  }`
  t.plan(1);
  await graphql(Schema, createQuery);
  await graphql(Schema, query);
  const dbUser = await r.table('users').getAll("emailpasswordreset:success@emailpasswordreset:success", {index: 'email'});
  const {resetToken} = dbUser[0].strategies.local;
  t.ok(resetToken)
});

test('emailPasswordReset:userdoesntexist', async t => {
  const query = `
  mutation {
    newUser: emailPasswordReset(
      email: "emailPasswordReset:userdoesntexist@emailPasswordReset:userdoesntexist"
    )
  }`
  t.plan(1);
  const result = await graphql(Schema, query);
  t.is(result.errors[0].message, '{"_error":"User not found"}');
});

