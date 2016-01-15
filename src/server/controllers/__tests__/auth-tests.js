//import test from 'ava';
//import 'babel-register';
//import 'babel-polyfill';
//import express from 'express';
//import request from 'supertest-as-promised';
//import makeAuthEndpoints from '../makeAuthEndpoints';
//import {signJwt} from '../auth';
//import {User, setResetTokenDB, signupDB} from '../../database/models/localStrategy';
//
//function makeApp() {
//  const app = express();
//  makeAuthEndpoints(app);
//  return app;
//}
//
//test('AuthController:signup:Success', async t => {
//  t.plan(4);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerSignup@Success', password: '123123'})
//  t.is(res.status, 200);
//  t.ok(res.body.authToken);
//  t.is(res.body.user.email, 'authcontrollersignup@success');
//  t.false(res.body.user.strategies.local.isVerified);
//});
//
//test('AuthController:signup:SchemaPasswordError', async t => {
//  t.plan(3);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerSignup@SchemaPasswordError', password: '1'});
//  t.is(res.status, 401);
//  t.is(res.body.error._error, 'Invalid credentials');
//  t.ok(res.body.error.password);
//});
//
//test('AuthController:signup:SchemaEmailError', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerSignup@SchemaEmailError.', password: '123123'});
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid credentials', email: 'That\'s not an email!'}})
//});
//
//test('AuthController:signupDB:AlreadyExists', async t => {
//  t.plan(3)
//  const app = makeApp();
//  await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerSignup@AlreadyExists', password: '123123'});
//  const res = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerSignup@AlreadyExists', password: 'XXXXXX'});
//  t.is(res.status, 401);
//  t.is(res.body.error._error, 'Cannot create account');
//  t.ok(res.body.error.email);
//});
//
//test('AuthController:login:Success', async t => {
//  t.plan(6);
//  const app = makeApp();
//  await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerLogin@Success', password: '123123'});
//  const res = await request(app)
//    .post('/auth/login')
//    .send({email: 'AuthControllerLogin@Success', password: '123123'});
//  t.is(res.status, 200);
//  t.ok(res.body.authToken);
//  t.ok(res.body.user.id);
//  t.is(res.body.user.email, 'authcontrollerlogin@success');
//  t.false(res.body.user.strategies.local.isVerified);
//  t.is(Object.keys(res.body.user).length,3);
//});
//
//test('AuthController:login:InvalidPasswordError', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/login')
//    .send({email: 'AuthControllerLogin@InvalidPasswordError', password: '12'});
//  t.is(res.status, 401);
//  t.same(res.body.error, {
//    _error: 'Invalid credentials',
//    password: 'Password should be at least 6 chars long'
//  })
//});
//
//test('AuthController:login:EmailNotFound', async t => {
//  t.plan(3);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/login')
//    .send({email: 'AuthControllerLogin@EmailNotFound', password: '123123'});
//  t.is(res.status, 401);
//  t.is(res.body.error.email, 'Email not found');
//  t.is(res.body.error._error, 'Login failed');
//});
//
//test('AuthController:login:IncorrectPassword', async t => {
//  t.plan(3);
//  const app = makeApp();
//  await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerLogin@IncorrectPassword', password: '123123'});
//  const res = await request(app)
//    .post('/auth/login')
//    .send({email: 'AuthControllerLogin@IncorrectPassword', password: 'XXXXXX'});
//  t.is(res.status, 401);
//  t.is(res.body.error.password, 'Incorrect password');
//  t.is(res.body.error._error, 'Login failed');
//});
//
//test('AuthController:loginToken:Success', async t => {
//  t.plan(5);
//  const app = makeApp();
//  const signupRes = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerLoginToken@Success', password: '123123'});
//  const res = await request(app)
//    .post('/auth/login-token')
//    .send({authToken: signupRes.body.authToken})
//  t.is(res.status, 200);
//  t.ok(res.body.user.id);
//  t.is(res.body.user.email, 'authcontrollerlogintoken@success');
//  t.false(res.body.user.strategies.local.isVerified);
//  t.is(Object.keys(res.body.user).length,3);
//});
//
//test('AuthController:loginToken:InvalidAuthToken', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const signupRes = await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControllerLoginToken@InvalidAuthToken', password: '123123'});
//  const res = await request(app)
//    .post('/auth/login-token')
//    .send({authToken: signupRes.body.authToken + 'foo'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid authentication Token'}});
//});
//
//test('AuthController:loginToken:InvalidUserId', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const authToken = signJwt({id: 'AuthControllerLoginTokenUserId'});
//  const res = await request(app)
//    .post('/auth/login-token')
//    .send({authToken})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'User not found'}});
//});
//
//test('AuthController:emailPasswordReset:Success', async t => {
//  t.plan(1);
//  const app = makeApp();
//  await request(app)
//    .post('/auth/signup')
//    .send({email: 'AuthControlleremailPasswordReset@Success', password: '123123'});
//  const res = await request(app)
//    .post('/auth/send-reset-email')
//    .send({email: 'AuthControlleremailPasswordReset@Success'})
//  t.is(res.status, 200);
//});
//
//test('AuthController:emailPasswordReset:EmailSchemaError', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/send-reset-email')
//    .send({email: 'xxx'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid credentials', email: 'That\'s not an email!'}})
//});
//
//test('AuthController:emailPasswordReset:EmailNotFound', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/send-reset-email')
//    .send({email: 'AuthControlleremailPasswordReset@EmailNotFoundX'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Reset failed', email: 'Email not found'}})
//});
//
//test('AuthController:resetPassword:Success', async t => {
//  t.plan(6);
//  const app = makeApp();
//  await request(app)
//    .post('/auth/signup')
//    .send({email: 'authcontrollerresetpassword@success', password: '123123'});
//  const resetToken = await setResetTokenDB('authcontrollerresetpassword@success');
//  const res = await request(app)
//    .post('/auth/reset-password')
//    .send({password: '1231231', resetToken})
//  t.is(res.status, 200);
//  t.ok(res.body.authToken);
//  t.ok(res.body.user.id);
//  t.is(res.body.user.email, 'authcontrollerresetpassword@success');
//  t.false(res.body.user.strategies.local.isVerified);
//  t.is(Object.keys(res.body.user).length,3);
//});
//
//test('AuthController:resetPassword:PasswordSchemaError', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/reset-password')
//    .send({password: '12', resetToken: 'foo'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid credentials', password: 'Password should be at least 6 chars long'}})
//});
//
//test('AuthController:resetPassword:InvalidResetToken', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/reset-password')
//    .send({password: '123123', resetToken: 'foo'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid Token'}})
//});
//
//test('AuthController:resetPassword:InvalidUserId', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const signupRes = await request(app)
//    .post('/auth/signup')
//    .send({email: 'authcontrollerresetpassword@invaliduserid', password: '123123'});
//  const resetToken = await setResetTokenDB('authcontrollerresetpassword@invaliduserid');
//  await User.get(signupRes.body.user.id).delete();
//  const res = await request(app)
//    .post('/auth/reset-password')
//    .send({password: '123123', resetToken})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'User not found'}});
//});
//
//test('AuthController:resetPassword:InvalidTokenInDB', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const signupRes = await request(app)
//    .post('/auth/signup')
//    .send({email: 'authcontrollerresetpassword@invalidtokenindb', password: '123123'});
//  const resetToken = await setResetTokenDB('authcontrollerresetpassword@invalidtokenindb');
//  await User.get(signupRes.body.user.id).update({strategies: {local: {resetToken: 'foo'}}}).execute();
//  const res = await request(app)
//    .post('/auth/reset-password')
//    .send({password: '123123', resetToken})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid token'}});
//});
//
//test('AuthController:verifyEmail:Success', async t => {
//  t.plan(1);
//  const app = makeApp();
//  const [safeUser, verifiedEmailToken] = await signupDB('authControllerVerifyEmail@Success', '123123');
//  const res = await request(app)
//    .post('/auth/verify-email')
//    .send({verifiedEmailToken})
//  t.is(res.status, 200);
//});
//
//test('AuthController:verifyEmail:InvalidVerifiedEmailToken', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const res = await request(app)
//    .post('/auth/verify-email')
//    .send({verifiedEmailToken: 'foo'})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'Invalid Token'}})
//});
//
//test('AuthController:verifyEmail:InvalidUserId', async t => {
//  t.plan(2);
//  const app = makeApp();
//  const [safeUser, verifiedEmailToken] = await signupDB('authControllerVerifyEmail@Success', '123123');
//  await User.get(safeUser.id).delete();
//  const res = await request(app)
//    .post('/auth/verify-email')
//    .send({verifiedEmailToken})
//  t.is(res.status, 401);
//  t.same(res.body, {error: {_error: 'User not found'}});
//});
