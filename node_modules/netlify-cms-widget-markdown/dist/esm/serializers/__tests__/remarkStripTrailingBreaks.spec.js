"use strict";

var _unified = _interopRequireDefault(require("unified"));

var _unistBuilder = _interopRequireDefault(require("unist-builder"));

var _remarkStripTrailingBreaks = _interopRequireDefault(require("../remarkStripTrailingBreaks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const process = children => {
  const tree = (0, _unistBuilder.default)('root', children);
  const strippedMdast = (0, _unified.default)().use(_remarkStripTrailingBreaks.default).runSync(tree);
  return strippedMdast.children;
};

describe('remarkStripTrailingBreaks', () => {
  it('should remove trailing breaks at the end of a block', () => {
    expect(process([(0, _unistBuilder.default)('break')])).toEqual([]);
    expect(process([(0, _unistBuilder.default)('break'), (0, _unistBuilder.default)('text', '\n  \n')])).toEqual([(0, _unistBuilder.default)('text', '\n  \n')]);
    expect(process([(0, _unistBuilder.default)('text', 'a'), (0, _unistBuilder.default)('break')])).toEqual([(0, _unistBuilder.default)('text', 'a')]);
  });
  it('should not remove trailing breaks that are not at the end of a block', () => {
    expect(process([(0, _unistBuilder.default)('break'), (0, _unistBuilder.default)('text', 'a')])).toEqual([(0, _unistBuilder.default)('break'), (0, _unistBuilder.default)('text', 'a')]);
  });
});