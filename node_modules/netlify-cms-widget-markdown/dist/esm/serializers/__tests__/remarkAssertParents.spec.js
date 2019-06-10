"use strict";

var _unistBuilder = _interopRequireDefault(require("unist-builder"));

var _remarkAssertParents = _interopRequireDefault(require("../remarkAssertParents"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transform = (0, _remarkAssertParents.default)();
describe('remarkAssertParents', () => {
  it('should unnest invalidly nested blocks', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('text', 'Paragraph text.')]), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('code', 'someCode()'), (0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('text', 'Quote text.')]), (0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('text', 'A list item.')])]), (0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('text', 'Text in a table cell.')])])]), (0, _unistBuilder.default)('thematicBreak')])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('text', 'Paragraph text.')]), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('code', 'someCode()'), (0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('text', 'Quote text.')]), (0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('text', 'A list item.')])]), (0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('text', 'Text in a table cell.')])])]), (0, _unistBuilder.default)('thematicBreak')]);
    expect(transform(input)).toEqual(output);
  });
  it('should unnest deeply nested blocks', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('text', 'Paragraph text.')]), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('code', 'someCode()'), (0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('strong', [(0, _unistBuilder.default)('heading', [(0, _unistBuilder.default)('text', 'Quote text.')])])])]), (0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('text', 'A list item.')])]), (0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('text', 'Text in a table cell.')])])]), (0, _unistBuilder.default)('thematicBreak')])])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('text', 'Paragraph text.')]), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('code', 'someCode()'), (0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('heading', [(0, _unistBuilder.default)('text', 'Quote text.')])]), (0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('text', 'A list item.')])]), (0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('text', 'Text in a table cell.')])])]), (0, _unistBuilder.default)('thematicBreak')]);
    expect(transform(input)).toEqual(output);
  });
  it('should remove blocks that are emptied as a result of denesting', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])]);
    expect(transform(input)).toEqual(output);
  });
  it('should remove blocks that are emptied as a result of denesting', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])]);
    expect(transform(input)).toEqual(output);
  });
  it('should handle assymetrical splits', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])]);
    expect(transform(input)).toEqual(output);
  });
  it('should nest invalidly nested blocks in the nearest valid ancestor', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('strong', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])])])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')])])]);
    expect(transform(input)).toEqual(output);
  });
  it('should preserve validly nested siblings of invalidly nested blocks', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('strong', [(0, _unistBuilder.default)('text', 'Deep validly nested text a.'), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('text', 'Deep validly nested text b.')])]), (0, _unistBuilder.default)('text', 'Validly nested text.')])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('strong', [(0, _unistBuilder.default)('text', 'Deep validly nested text a.')]), (0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Heading text.')]), (0, _unistBuilder.default)('strong', [(0, _unistBuilder.default)('text', 'Deep validly nested text b.')])]), (0, _unistBuilder.default)('paragraph', [(0, _unistBuilder.default)('text', 'Validly nested text.')])]);
    expect(transform(input)).toEqual(output);
  });
  it('should allow intermediate parents like list and table to contain required block children', () => {
    const input = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Validly nested heading text.')])])])])])])])]);
    const output = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('blockquote', [(0, _unistBuilder.default)('list', [(0, _unistBuilder.default)('listItem', [(0, _unistBuilder.default)('table', [(0, _unistBuilder.default)('tableRow', [(0, _unistBuilder.default)('tableCell', [(0, _unistBuilder.default)('heading', {
      depth: 1
    }, [(0, _unistBuilder.default)('text', 'Validly nested heading text.')])])])])])])])]);
    expect(transform(input)).toEqual(output);
  });
});