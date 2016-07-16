import libs from 'node-libs-browser';
// libs exports a map of module numbers, not the modules themselves
const process = __webpack_require__(libs.process);
// overwrite env with variables that have been provided from a SSR script
export default {...process, env: window.__env__}
