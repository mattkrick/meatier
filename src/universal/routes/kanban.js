import {requireAuth} from './utils';
import makeReducer from '../redux/makeReducer';
import {resolvePromiseMap} from '../utils/promises';

export default function (store) {
  return {
    // sometimes onEnter is called twice when async func requireAuth uses immutable-js. w.t.f.
    onEnter: requireAuth(store),
    path: 'kanban',
    getComponent: async (location, cb) => {
      let promiseMap = setKanbanImports();
      let importMap = await resolvePromiseMap(promiseMap);
      let {component, optimist, ...asyncReducers} = getKanbanImports(importMap);
      let newReducer = makeReducer(asyncReducers, optimist);
      store.replaceReducer(newReducer);
      cb(null, component);
    }
  }
}

function setKanbanImports() {
  return new Map([
    ['component', System.import('../containers/Kanban/KanbanContainer')],
    ['optimist', System.import('../redux-optimist')],
    ['lanes', System.import('../redux/ducks/lanes')],
    ['notes', System.import('../redux/ducks/notes')],
    ['socket', System.import('redux-socket-cluster')]
  ]);
}

function getKanbanImports(importMap) {
  return {
    component: importMap.get('component'),
    optimist: importMap.get('optimist').optimist,
    lanes: importMap.get('lanes').reducer,
    notes: importMap.get('notes').reducer,
    socket: importMap.get('socket').socketClusterReducer
  }
}
