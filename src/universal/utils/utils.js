export function delay(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

export function parseJSON(response) {
  return response.json()
}

export function hostUrl() {
  const {host, protocol} = window.location;
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

export function parsedJoiErrors(error) {
  if (!error) return {};
  const errors = {};
  const allErrors = error.details;
  for (let i = 0; i < allErrors.length; i++) {
    let curError = allErrors[i];
    if (errors[curError.path]) continue;
    errors[curError.path] = curError.message;
  }
  return errors;
}
