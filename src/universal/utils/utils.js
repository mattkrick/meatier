import fetch from 'isomorphic-fetch';

//export function delay(ms) {
//  return new Promise(function (resolve) {
//    setTimeout(resolve, ms);
//  });
//}

export function parseJSON(response) {
  return response.json()
}

export function hostUrl() {
  let host, protocol;
  if (__CLIENT__) {
    host = window.location.host;
    protocol = window.location.protocol;
  } else {
    host = 'localhost:3000';
    protocol= 'http:';
  }
  return `${protocol}//${host}`;
}

export function postJSON(route, obj) {
  return fetch(hostUrl() + route, {
    method: 'post',
    credentials: 'include',
    headers: {
      'Accept'  : 'application/json',
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

