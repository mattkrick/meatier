import {parse} from 'url';

const subRequirements = {
  allLanes: [checkUserId]
}

function checkUserId(socket,query) {
  const token = socket.getAuthToken();
  console.log('checking user id');
  if (!token || !token.id) {
    console.log('invalid userId');
    return 'Invalid userId';
  }
}
//handles authorization for everything on the lanes table
export default function permissionChecker(socket, subscription, next) {
  console.log('in checker');
  const parsedSub = parse(subscription, true); //turn query into obj
  const {pathname: channel, query} = parsedSub;
  if (!subRequirements[channel]) {
    return next('Invalid subscription');
  }
  const reqs = subRequirements[channel];
  for (let i = 0; i < reqs.length; i++) {
    let checkFunc = reqs[i];
    let error = checkFunc(socket, query);
    if (error) {
      return next(error);
    }
  }

  console.log('permissionChecker passed');
  next();
}
