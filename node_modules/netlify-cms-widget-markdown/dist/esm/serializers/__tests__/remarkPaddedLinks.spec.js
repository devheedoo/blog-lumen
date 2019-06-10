"use strict";

var _unified = _interopRequireDefault(require("unified"));

var _remarkParse = _interopRequireDefault(require("remark-parse"));

var _remarkStringify = _interopRequireDefault(require("remark-stringify"));

var _remarkPaddedLinks = _interopRequireDefault(require("../remarkPaddedLinks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const input = markdown => (0, _unified.default)().use(_remarkParse.default).use(_remarkPaddedLinks.default).use(_remarkStringify.default).processSync(markdown).contents;

const output = markdown => (0, _unified.default)().use(_remarkParse.default).use(_remarkStringify.default).processSync(markdown).contents;

describe('remarkPaddedLinks', () => {
  it('should move leading and trailing spaces outside of a link', () => {
    expect(input('[ a ](b)')).toEqual(output(' [a](b) '));
  });
  it('should convert multiple leading or trailing spaces to a single space', () => {
    expect(input('[  a  ](b)')).toEqual(output(' [a](b) '));
  });
  it('should work with only a leading space or only a trailing space', () => {
    expect(input('[ a](b)[c ](d)')).toEqual(output(' [a](b)[c](d) '));
  });
  it('should work for nested links', () => {
    expect(input('* # a[ b ](c)d')).toEqual(output('* # a [b](c) d'));
  });
  it('should work for parents with multiple links that are not siblings', () => {
    expect(input('# a[ b ](c)d **[ e ](f)**')).toEqual(output('# a [b](c) d ** [e](f) **'));
  });
  it('should work for links with arbitrarily nested children', () => {
    expect(input('[ a __*b*__ _c_ ](d)')).toEqual(output(' [a __*b*__ _c_](d) '));
  });
});