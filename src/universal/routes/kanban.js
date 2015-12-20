import {requireAuth} from './utils';

export default function(store) {
  return {
    onEnter: requireAuth(store),
    path: 'kanban',
    getComponent: async (location, cb) => {
      let mod = await System.import('../containers/Kanban/KanbanContainer');
      cb(null, mod.default);
    }
  }
}
