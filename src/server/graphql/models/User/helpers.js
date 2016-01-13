import {errorObj} from '../utils';

export async function getUserByEmail(email) {
  let users;
  try {
    users = await User.getAll(email, {index: 'email'}).limit(1).run();
  } catch (e) {
    throw errorObj({_error: 'Database access error. Please try again'});
  }
  return users[0];
}
