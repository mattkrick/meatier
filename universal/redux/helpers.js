export function addImmutable(newEvent, events) {
  return [newEvent, ...events]
}

export function updateImmutable(newEvent, events) {
  return events.map(event =>
      event.id === newEvent.id ? newEvent : event
  )
}

export function deleteImmutable(id, events) {
  return events.filter(event => event.id !== id);
}

export function findInState(events, id) {
  return events.findIndex(event => event.id === id);
}
