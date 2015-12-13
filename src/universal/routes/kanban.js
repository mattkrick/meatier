import {requireAuth} from './utils';

export default function(store) {
  return {
    onEnter: requireAuth,
    path: 'kanban',
    getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('../containers/Kanban/KanbanContainer'))
      })
    }
  }
}
