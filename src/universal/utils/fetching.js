import fetch from 'isomorphic-fetch';

export function parseJSON(response) {
  return response.json()
}

export function hostUrl() {
  let host, protocol;
  //testing doesn't know about webpack & throws an error if window is inside a conditional
  //if (__CLIENT__) {
  //  host = window.location.host;
  //  protocol = window.location.protocol;
  //} else {
  host = 'localhost:3000';
  protocol = 'http:';
  //}
  return `${protocol}//${host}`;
}

export function postJSON(route, obj) {
  return fetch(hostUrl() + route, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(obj)
  })
}

export function getJSON(route) {
  return fetch(hostUrl() + route)
}

//export function pick(o, ...fields) {
//  return Object.assign({}, ...(for (p of fields) {[p]: o[p]}));
//}

