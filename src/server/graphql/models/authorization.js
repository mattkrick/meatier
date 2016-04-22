import {errorObj} from './utils';

export const isLoggedIn = authToken => {
  if (!authToken || !authToken.id) {
    throw errorObj({_error: 'Unauthorized'});
  }
};

export const isAdminOrSelf = (authToken, {id}) => {
  const {id: verifiedId, isAdmin} = authToken;
  if (!isAdmin && verifiedId !== id) {
    throw errorObj({_error: 'Unauthorized'});
  }
};
