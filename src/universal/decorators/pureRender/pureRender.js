import shallowCompare from 'react-addons-shallow-compare';

export default function pureRenderDecorator(target) {
  target.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }
}
