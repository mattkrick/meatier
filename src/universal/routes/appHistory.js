import { useRouterHistory, browserHistory } from 'react-router'
import { createHistory } from 'history'

let appHistory = browserHistory;

if (process.env.BASENAME) {
  appHistory = useRouterHistory(createHistory)({
    basename: process.env.BASENAME 
  }); 
}

export default appHistory;
