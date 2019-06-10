"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _slate = require("slate");

var _isHotkey = _interopRequireDefault(require("is-hotkey"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _default = onKeyDown;
exports.default = _default;

function onKeyDown(event, change) {
  const createDefaultBlock = () => {
    return _slate.Block.create({
      type: 'paragraph',
      nodes: [_slate.Text.create('')]
    });
  };

  if ((0, _isHotkey.default)('Enter', event)) {
    /**
     * If "Enter" is pressed while a single void block is selected, a new
     * paragraph should be added above or below it, and the current selection
     * (range) should be collapsed to the start of the new paragraph.
     *
     * If the selected block is the first block in the document, create the
     * new block above it. If not, create the new block below it.
     */
    const _change$value = change.value,
          doc = _change$value.document,
          anchorBlock = _change$value.anchorBlock,
          focusBlock = _change$value.focusBlock;
    const singleBlockSelected = anchorBlock === focusBlock;
    if (!singleBlockSelected || !focusBlock.isVoid) return;
    event.preventDefault();
    const focusBlockParent = doc.getParent(focusBlock.key);
    const focusBlockIndex = focusBlockParent.nodes.indexOf(focusBlock);
    const focusBlockIsFirstChild = focusBlockIndex === 0;
    const newBlock = createDefaultBlock();
    const newBlockIndex = focusBlockIsFirstChild ? 0 : focusBlockIndex + 1;
    return change.insertNodeByKey(focusBlockParent.key, newBlockIndex, newBlock).collapseToStartOf(newBlock);
  }

  const marks = [['b', 'bold'], ['i', 'italic'], ['s', 'strikethrough'], ['`', 'code']];

  const _ref = marks.find((_ref3) => {
    let _ref4 = _slicedToArray(_ref3, 1),
        key = _ref4[0];

    return (0, _isHotkey.default)(`mod+${key}`, event);
  }) || [],
        _ref2 = _slicedToArray(_ref, 2),
        markName = _ref2[1];

  if (markName) {
    event.preventDefault();
    return change.toggleMark(markName);
  }
}