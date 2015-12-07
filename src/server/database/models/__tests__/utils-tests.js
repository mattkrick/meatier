import test from 'ava';
import 'babel-core/register';
import {getAltLoginMessage} from '../utils';

test('DatabaseUtils:getAltLoginMessage:LocalAndGoogle', t => {
  t.plan(1);
  const mockStrategies = {
    local: {
      isVerified: false,
      password: 'fooie'
    },
    google: {
      isVerified: true,
      email: 'getAltLoginMessage@LocalAndGoogle'
    }
  }
  const suggestion = getAltLoginMessage(mockStrategies);
  t.is(suggestion, 'Try logging in with your password, or google');
});

test('DatabaseUtils:getAltLoginMessage:Local', t => {
  t.plan(1);
  const mockStrategies = {
    local: {
      isVerified: false,
      password: 'fooie'
    }
  }
  const suggestion = getAltLoginMessage(mockStrategies);
  t.is(suggestion, 'Try logging in with your password');
});
