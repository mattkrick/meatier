import {parse} from 'url';
import allLanes from './allLanes';
import allNotes from './allNotes';

const handler = {
  allLanes,
  allNotes
}

export default function (subscription) {
  //"this" is the socket
  const parsedSub = parse(subscription, true);
  const {pathname: channel, query} = parsedSub;
  const channelHandler = handler[channel];
  return channelHandler && channelHandler.call(this, channel, query);
}
