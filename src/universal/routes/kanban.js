import {requireAuth} from './requireNoAuth';
import makeReducer from '../redux/makeReducer';
import {resolvePromiseMap} from '../utils/promises';

export default function (store) {
  return {
    path: 'kanban',
    getComponent: async (location, cb) => {
      let promiseMap = setKanbanImports();
      let importMap = await resolvePromiseMap(promiseMap);
      let {component, optimistic, ...asyncReducers} = getKanbanImports(importMap);
      let newReducer = makeReducer(asyncReducers, optimistic);
      store.replaceReducer(newReducer);
      cb(null, component);
    }
  }
}

function setKanbanImports() {
  return new Map([
    ['component', System.import('../containers/Kanban/KanbanContainer')],
    ['optimistic', System.import('redux-optimistic-ui')],
    ['lanes', System.import('../redux/ducks/lanes')],
    ['notes', System.import('../redux/ducks/notes')],
    ['socket', System.import('redux-socket-cluster')]
  ]);
}

function getKanbanImports(importMap) {
  return {
    component: importMap.get('component'),
    optimistic: importMap.get('optimistic').optimistic,
    lanes: importMap.get('lanes').reducer,
    notes: importMap.get('notes').reducer,
    socket: importMap.get('socket').socketClusterReducer
  }
}
