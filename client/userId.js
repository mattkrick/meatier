import uuid from 'node-uuid';

const userIdKey = 'kanban-userId';

export function hasLocalStorage() {
  return (!!window.localStorage);
}

export function getUserId() {
  return window.localStorage.getItem(userIdKey);
}

export function setUserId() {
  let id = uuid.v1();
  window.localStorage.setItem(userIdKey, id);
  return id;
}

export function getOrSetUserId() {
  if (!hasLocalStorage()) {
    return 'baseUser';
  } else {
    let userId = getUserId();
    return (userId) ? userId : setUserId();
  }
}
