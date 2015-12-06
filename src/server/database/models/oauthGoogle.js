import {User} from './users';
import {DocumentNotFoundError, AuthenticationError} from '../errors';
import {getUserByEmail, getSafeUser, getAltLoginMessage} from './utils';

export async function loginWithGoogleDB(profile) {
  let user
  try {
    user = await getUserByEmail(profile.email);
  } catch (e) {
    throw e
  }
  if (!user) {
    //create new user
    const userDoc = {
      email: profile.email,
      createdAt: Date.now(),
      strategies: {
        google: {
          id: profile.id,
          email: profile.email,
          isVerified: profile.verified_email, //we'll assume this is always true
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          picutre: profile.picture,
          gender: profile.gender,
          locale: profile.locale
        }
      }
    }
    let newUser;
    try {
      newUser = await User.save(userDoc);
    } catch (e) {
      throw e
    }
    return getSafeUser(newUser);
  }
  //if the user already exists && they have a google strategy
  if (user.strategies.google) {
    if (user.strategies.google.id !== profile.id) {
      throw new AuthenticationError();
    }
    return getSafeUser(user);
  }
  //if the user already exists && they don't have a google strategy
  throw new AuthenticationError(getAltLoginMessage(user.strategies))
}
