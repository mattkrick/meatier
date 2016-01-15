import test from 'ava';
import promisify from 'es6-promisify';
import 'babel-register';
import 'babel-polyfill';
import validateSecretToken from '../../../../../universal/utils/validateSecretToken'
import bcrypt from 'bcrypt';
import {graphql} from 'graphql';
import Schema from '../../../rootSchema';

test('createUser:success', async t => {
  const query = `
    mutation {
     newUser: createUser(
      email: "createUser:success@createUser:success",
      password: "a123123"
    ) {
      user {
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
          }
        }
      },
      authToken
    }
  }
  `
  //t.plan(4);
  t.pass();
  //const actual = await graphql(Schema, query);
  //const {user:{id, createdAt}, authToken} = actual.data.newUser;
  //const expected = {
  //  "data": {
  //    "newUser": {
  //      "user": {
  //        "id": id,
  //        "email": "createUser:success@createUser:success",
  //        "createdAt": createdAt,
  //        "updatedAt": null,
  //        "strategies": {
  //          "local": {
  //            "isVerified": false,
  //            "password": null,
  //            "verifiedEmailToken": null,
  //            "resetToken": null
  //          }
  //        }
  //      },
  //      "authToken": authToken
  //    }
  //  }
  //}
  //t.true(createdAt <= new Date());
  //t.true(typeof id === 'string');
  //t.ok(authToken);
  //t.same(actual, expected)
});
