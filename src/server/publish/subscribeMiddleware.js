import {parse} from 'url';

const subRequirements = {
  allLanes: [checkUserId],
  allNotes: []
}
//checking token expiry automatically will be part of SCv4
function checkUserId(socket,query) {
  const authToken = socket.getAuthToken();
  if (!authToken || !authToken.id) {
    return new Error('Invalid userId');
  }
}

export default function permissionChecker(req, next) {
  const {socket, channel: subscription} = req;
  const parsedSub = parse(subscription, true); //turn query into obj
  const {pathname: channel, query} = parsedSub;
  if (!subRequirements[channel]) {
    return next(new Error('Invalid subscription'));
  }
  if (req.authTokenExpiredError) {
    next(req.authTokenExpiredError);
  }
  //handle subscription-specific authorization
  const reqs = subRequirements[channel];
  for (let i = 0; i < reqs.length; i++) {
    let checkFunc = reqs[i];
    let error = checkFunc(socket, query);
    if (error) {
      return next(error);
    }
  }
  next();
}
