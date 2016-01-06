export function addImmutable(newAction, subState) {
  return [...subState, newAction]
}

export function updateImmutable(newAction, subState) {
  return subState.map(event =>
      event.id === newAction.id ? Object.assign({},event,newAction) : event
  )
}

export function deleteImmutable(id, subState) {
  return subState.filter(event => event.id !== id);
}

export function findInState(subState, id) {
  return subState.findIndex(event => event.id === id);
}

export function getFormState(state, reduxMountPoint) {
  //console.log('form state', state.get(reduxMountPoint));
  return state.get(reduxMountPoint);
  //return state.get(reduxMountPoint).toJS();
}
