/* A secret token is a reset or email verification token, not a JWT*/
export default function validateSecretToken(secretToken) {
  const invalidToken = {_error: 'Invalid Token'};
  if (typeof secretToken !== 'string') {
    return invalidToken;
  }
  let secretTokenStr;
  if (typeof Buffer === 'function') {
    secretTokenStr = new Buffer(secretToken, 'base64').toString('ascii');
  } else if (typeof atob === 'function') {
    secretTokenStr = atob(secretToken);
  } else {
    return invalidToken;
  }
  let secretTokenObj;
  try {
    secretTokenObj = JSON.parse(secretTokenStr);
  } catch (e) {
    return invalidToken;
  }

  if (!secretTokenObj.exp || !secretTokenObj.id || !secretTokenObj.sec || Object.keys(secretTokenObj).length !== 3) {
    return invalidToken;
  }

  if (secretTokenObj.exp < Date.now()) {
    invalidToken._error = 'Your token has expired, please try sending a new email';
    return invalidToken;
  }
  return secretTokenObj;
}
