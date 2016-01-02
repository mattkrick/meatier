import test from 'ava';
import 'babel-register';
import 'babel-polyfill';
import express from 'express';
import request from 'supertest-as-promised';
import makeAuthEndpoints from '../makeAuthEndpoints';

let app;
test.beforeEach(() => {
  app = express();
  makeAuthEndpoints(app);
})

test('AuthController:signup:Success', async t => {
  t.plan(4);
  const res = await request(app)
    .post('/auth/signup')
    .send({email: 'AuthControllerSignup@Success', password: '123123'})
  t.is(res.status, 200);
  t.ok(res.body.authToken);
  t.is(res.body.user.email, 'authcontrollersignup@success');
  t.false(res.body.user.strategies.local.isVerified);
});

test('AuthController:signup:SchemaPasswordError', async t => {
  t.plan(3);
  const res = await request(app)
    .post('/auth/signup')
    .send({email: 'AuthControllerSignup@SchemaPasswordError', password: '1'});
  t.is(res.status, 401);
  t.is(res.body.error._error, 'Invalid credentials');
  t.ok(res.body.error.password);
});

test('AuthController:signup:SchemaEmailError', async t => {
  t.plan(3);
  const res = await request(app)
    .post('/auth/signup')
    .send({email: 'AuthControllerSignup@SchemaEmailError.', password: '123123'});
  t.is(res.status, 401);
  t.is(res.body.error._error, 'Invalid credentials');
  t.ok(res.body.error.email);
});

test('AuthController:signupDB:AlreadyExists', async t => {
  t.plan(3)
  await request(app)
    .post('/auth/signup')
    .send({email: 'AuthControllerSignup@AlreadyExists', password: '123123'});
  const res = await request(app)
    .post('/auth/signup')
    .send({email: 'AuthControllerSignup@AlreadyExists', password: 'XXXXXX'});
  t.is(res.status, 401);
  t.is(res.body.error._error, 'Cannot create account');
  t.ok(res.body.error.email);
});

