export default function validateSecretToken(token) {
  const invalidToken = {
    error: {
      _error: 'Invalid Token'
    }
  }
  if (!token || typeof token !== 'string') {
    return invalidToken;
  }
  let tokenStr;
  if (typeof Buffer === 'function') {
    tokenStr = new Buffer(token, 'base64').toString('ascii');
  } else if (typeof atob === 'function') {
    tokenStr = atob(token);
  } else {
    return invalidToken;
  }
  let tokenObject;
  try {
    tokenObject = JSON.parse(tokenStr);
  } catch (e) {
    return invalidToken;
  }

  if (!tokenObject.exp || !tokenObject.id || !tokenObject.sec || Object.keys(tokenObject).length !== 3) {
    return invalidToken;
  }

  if (tokenObject.exp < Date.now()) {
    invalidToken.error._error = 'Email token has expired, please try resending a new email';
    return invalidToken;
  }
  return tokenObject;
}
