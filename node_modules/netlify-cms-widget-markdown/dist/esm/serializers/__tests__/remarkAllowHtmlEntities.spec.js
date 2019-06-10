"use strict";

var _unified = _interopRequireDefault(require("unified"));

var _remarkParse = _interopRequireDefault(require("remark-parse"));

var _remarkAllowHtmlEntities = _interopRequireDefault(require("../remarkAllowHtmlEntities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const process = markdown => {
  const mdast = (0, _unified.default)().use(_remarkParse.default).use(_remarkAllowHtmlEntities.default).parse(markdown);
  /**
   * The MDAST will look like:
   *
   * { type: 'root', children: [
   *   { type: 'paragraph', children: [
   *     // results here
   *   ]}
   * ]}
   */

  return mdast.children[0].children[0].value;
};

describe('remarkAllowHtmlEntities', () => {
  it('should not decode HTML entities', () => {
    expect(process('&lt;div&gt;')).toEqual('&lt;div&gt;');
  });
});