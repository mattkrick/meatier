import {login} from '../auth';

test.before(async t => {
  await r.table('users').delete()
});
test.after(async t => {
  await r.table('users').delete()
});

test('AuthController:login:Success', async t => {
  t.plan(3);
  const [safeUser, verifiedEmailToken] = await signupDB('Signup@success', '123123');
  t.is(safeUser.email, 'signup@success');
  t.same(safeUser.strategies, {local: {isVerified: false}});
  t.ok(verifiedEmailToken);
});

