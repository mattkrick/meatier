import test from 'ava';
import 'babel-core/register';
import {login} from '../auth';
import fetch from 'isomorphic-fetch';
import {hostUrl, postJSON} from '../../../universal/utils/utils'

test('AuthController:signup:Success', async t => {
  t.plan(4);
  const res = await postJSON('/auth/signup', {email: 'AuthControllerSignup@Success', password: '123123'});
  const parsedRes = await res.json();
  t.is(res.status, 200);
  t.ok(parsedRes.authToken);
  t.is(parsedRes.user.email, 'authcontrollersignup@success');
  t.false(parsedRes.user.strategies.local.isVerified);
});

test('AuthController:signup:SchemaPasswordError', async t => {
  t.plan(3);
  const res = await postJSON('/auth/signup', {email: 'AuthControllerSignup@SchemaPasswordError', password: '1'});
  const parsedRes = await res.json();
  t.is(res.status, 401);
  t.is(parsedRes.error._error, 'Invalid credentials');
  t.ok(parsedRes.error.password);
});

test('AuthController:signup:SchemaEmailError', async t => {
  t.plan(3);
  const res = await postJSON('/auth/signup', {email: 'AuthControllerSignup@SchemaEmailError.', password: '123123'});
  const parsedRes = await res.json();
  t.is(res.status, 401);
  t.is(parsedRes.error._error, 'Invalid credentials');
  t.ok(parsedRes.error.email);
});

test('AuthController:signupDB:AlreadyExists', async t => {
  t.plan(3)
  await postJSON('/auth/signup', {email: 'AuthControllerSignup@AlreadyExists', password: '123123'});
  const res = await postJSON('/auth/signup', {email: 'AuthControllerSignup@AlreadyExists', password: 'XXXXXX'});
  const parsedRes = await res.json();
  t.is(res.status, 401);
  t.is(parsedRes.error._error, 'Cannot create account');
  t.ok(parsedRes.error.email);
});

// ?test('AuthController:login:Success', async t => {
// ?  t.plan(1);
//  const res = await postJSON('/auth/login', {email: 'AuthControllerlogin@Success', password: '123123'});
//  const parsedRes = await res.json();
//  t.is(res.status, 200);
//});

