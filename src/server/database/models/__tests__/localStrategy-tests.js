import test from 'ava';
import 'babel-core/register';
import promisify from 'es6-promisify';
import validateSecretToken from '../../../../universal/utils/validateSecretToken'
import thinky from '../thinky';
import bcrypt from 'bcrypt';
import {User, loginDB, signupDB, getUserByIdDB, setResetTokenDB,
  resetPasswordFromTokenDB, resetVerifiedTokenDB, verifyEmailDB} from '../localStrategy';

const {r} = thinky;
const compare = promisify(bcrypt.compare);

test.before(async t => {
  await r.table('users').delete()
});
test.after(async t => {
  await r.table('users').delete()
});

test('LocalStrategy:signupDB:Success', async t => {
  t.plan(3);
  const [safeUser, verifiedEmailToken] = await signupDB('Signup@success', '123123');
  t.is(safeUser.email, 'signup@success');
  t.same(safeUser.strategies, {local: {isVerified: false}});
  t.ok(verifiedEmailToken);
});

test('LocalStrategy:signupDB:HashedPassword', async t => {
  t.plan(1);
  const [safeUser] = await signupDB('Signup@success', '123123');
  const user = await User.get(safeUser.id).run();
  t.true(await compare('123123', user.strategies.local.password))
});

test('LocalStrategy:signupDB:VerifiedEmailToken', async t => {
  t.plan(3);
  const [user, verifiedEmailToken] = await signupDB('signup@emailToken', '123123');
  const verifiedEmailTokenObj = validateSecretToken(verifiedEmailToken);
  t.is(verifiedEmailTokenObj.id, user.id);
  t.true(verifiedEmailTokenObj.exp > Date.now());
  t.true(verifiedEmailTokenObj.sec.length >= 8);
});

test('LocalStrategy:signupDB:AlreadyExists', async t => {
  t.plan(1)
  await signupDB('signup@alreadyexists', '123123');
  return t.throws(signupDB('signup@alreadyexists', 'XXXXXX'), /AuthenticationError/)
});

test('LocalStrategy:signupDB:DuplicateFound', async t => {
  t.plan(1)
  await User.save({email: 'signup@nolocalstrategy', strategies: {noLocal: {isVerified: true}}});
  return t.throws(signupDB('signup@nolocalstrategy', 'XXXXXX'), /DuplicateFoundError/)
});

test('LocalStrategy:signupDB:ConvertToLogin', async t => {
  t.plan(3)
  await signupDB('signup@login', '123123');
  const [user, verifiedEmailToken] = await signupDB('signup@login', '123123');
  t.is(user.email, 'signup@login');
  t.same(user.strategies, {local: {isVerified: false}});
  t.is(verifiedEmailToken, null);
});

test('LocalStrategy:loginDB:Password', async t => {
  t.plan(2)
  await signupDB('Login@password', '123123');
  const user = await loginDB('logiN@password', '123123');
  t.is(user.email, 'login@password');
  t.same(user.strategies, {local: {isVerified: false}});
});

test('LocalStrategy:loginDB:UserNotFound', async t => {
  t.plan(1)
  return t.throws(loginDB('login@userNotFound', '123123'), /DocumentNotFoundError/);
});

test('LocalStrategy:loginDB:IncorrectPassword', async t => {
  t.plan(1)
  await signupDB('login@badpassword', '123123');
  return t.throws(loginDB('login@badpassword', 'XXXXXX'), /AuthenticationError/);
});

test('LocalStrategy:loginDB:NoLocalStrategy', async t => {
  t.plan(1)
  await User.save({email: 'login@nolocalstrategy', strategies: {noLocal: {isVerified: true}}});
  return t.throws(loginDB('login@nolocalstrategy', 'XXXXXX'), /DuplicateFoundError/);
});

test('LocalStrategy:getUserById:success', async t => {
  t.plan(2)
  const [safeUser] = await signupDB('helpers@getuserbyid', '123123');
  const user = await getUserByIdDB(safeUser.id);
  t.is(user.email, 'helpers@getuserbyid');
  t.same(user.strategies, {local: {isVerified: false}});
});

test('LocalStrategy:setResetTokenDB:EmailNotFound', async t => {
  t.plan(1)
  return t.throws(setResetTokenDB('setResetTokenDB@EmailNotFound'), /DocumentNotFoundError/);
});

test('LocalStrategy:setResetTokenDB:Success', async t => {
  t.plan(2)
  const [safeUser] = await signupDB('setResetTokenDB@success', '123123');
  const resetToken = await setResetTokenDB('setResetTokenDB@success')
  const user = await User.get(safeUser.id).run();
  t.ok(resetToken);
  t.is(resetToken, user.strategies.local.resetToken);
});

test('LocalStrategy:resetPasswordFromTokenDB:NoResetTokenSet', async t => {
  t.plan(1)
  const [safeUser] = await signupDB('resetPasswordFromTokenDB@NoResetTokenSet', '123123');
  return t.throws(resetPasswordFromTokenDB(safeUser.id, 'badToken', 'newPass'), /AuthenticationError/)
});

test('LocalStrategy:resetPasswordFromTokenDB:BadToken', async t => {
  t.plan(1)
  const [safeUser] = await signupDB('resetPasswordFromTokenDB@BadToken', '123123');
  const resetToken = await setResetTokenDB('resetPasswordFromTokenDB@BadToken');
  return t.throws(resetPasswordFromTokenDB(safeUser.id, 'badToken', 'newPass'), /AuthenticationError/)
});

test('LocalStrategy:resetPasswordFromTokenDB:Success', async t => {
  t.plan(1)
  const [safeUser] = await signupDB('resetPasswordFromTokenDB@Success', '123123');
  const resetToken = await setResetTokenDB('resetPasswordFromTokenDB@Success');
  await resetPasswordFromTokenDB(safeUser.id, resetToken, 'newPass')
  const user = await User.get(safeUser.id).run();
  t.true(await compare('newPass', user.strategies.local.password))
});

test('LocalStrategy:resetVerifiedTokenDB:EmailAlreadyVerified', async t => {
  t.plan(1)
  const [safeUser] = await signupDB('resetVerifiedTokenDB@EmailAlreadyVerified', '123123');
  await User.get(safeUser.id).update({strategies: {local: {isVerified: true}}}).execute();
  return t.throws(resetVerifiedTokenDB(safeUser.id), /AuthenticationError/);
});

test('LocalStrategy:resetVerifiedTokenDB:Success', async t => {
  t.plan(2)
  const [safeUser, verifiedEmailToken] = await signupDB('resetVerifiedTokenDB@Success', '123123');
  const returnedVerifiedEmailToken = await resetVerifiedTokenDB(safeUser.id);
  const user = await User.get(safeUser.id).run();
  const storedVerifiedEmailToken = user.strategies.local.verifiedToken;
  t.not(verifiedEmailToken, returnedVerifiedEmailToken);
  t.is(returnedVerifiedEmailToken, storedVerifiedEmailToken);
});

test('LocalStrategy:verifyEmailDB:EmailAlreadyVerified', async t => {
  t.plan(1)
  const [safeUser, verifiedEmailToken] = await signupDB('verifyEmailDB@EmailAlreadyVerified', '123123');
  await verifyEmailDB(safeUser.id, verifiedEmailToken);
  return t.throws(verifyEmailDB(safeUser.id, verifiedEmailToken), /AuthenticationError/);
});

test('LocalStrategy:verifyEmailDB:InvalidVerificationToken', async t => {
  t.plan(1)
  const [safeUser] = await signupDB('verifyEmailDB@InvalidVerificationToken', '123123');
  return t.throws(verifyEmailDB(safeUser.id, 'foo'), /AuthenticationError/);
});

test('LocalStrategy:verifyEmailDB:Success', async t => {
  t.plan(2)
  const [safeUser, verifiedEmailToken] = await signupDB('verifyEmailDB@Success', '123123');
  await verifyEmailDB(safeUser.id, verifiedEmailToken);
  const user = await User.get(safeUser.id).run();
  t.is(user.strategies.local.verifiedToken, null);
  t.true(user.strategies.local.isVerified);
});
