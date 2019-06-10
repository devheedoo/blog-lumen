"use strict";

var _unified = _interopRequireDefault(require("unified"));

var _unistBuilder = _interopRequireDefault(require("unist-builder"));

var _remarkEscapeMarkdownEntities = _interopRequireDefault(require("../remarkEscapeMarkdownEntities"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const process = text => {
  const tree = (0, _unistBuilder.default)('root', [(0, _unistBuilder.default)('text', text)]);
  const escapedMdast = (0, _unified.default)().use(_remarkEscapeMarkdownEntities.default).runSync(tree);
  return escapedMdast.children[0].value;
};

describe('remarkEscapeMarkdownEntities', () => {
  it('should escape common markdown entities', () => {
    expect(process('*a*')).toEqual('\\*a\\*');
    expect(process('**a**')).toEqual('\\*\\*a\\*\\*');
    expect(process('***a***')).toEqual('\\*\\*\\*a\\*\\*\\*');
    expect(process('_a_')).toEqual('\\_a\\_');
    expect(process('__a__')).toEqual('\\_\\_a\\_\\_');
    expect(process('~~a~~')).toEqual('\\~\\~a\\~\\~');
    expect(process('[]')).toEqual('\\[]');
    expect(process('[]()')).toEqual('\\[]()');
    expect(process('[a](b)')).toEqual('\\[a](b)');
    expect(process('[Test sentence.](https://www.example.com)')).toEqual('\\[Test sentence.](https://www.example.com)');
    expect(process('![a](b)')).toEqual('!\\[a](b)');
  });
  it('should not escape inactive, single markdown entities', () => {
    expect(process('a*b')).toEqual('a*b');
    expect(process('_')).toEqual('_');
    expect(process('~')).toEqual('~');
    expect(process('[')).toEqual('[');
  });
  it('should escape leading markdown entities', () => {
    expect(process('#')).toEqual('\\#');
    expect(process('-')).toEqual('\\-');
    expect(process('*')).toEqual('\\*');
    expect(process('>')).toEqual('\\>');
    expect(process('=')).toEqual('\\=');
    expect(process('|')).toEqual('\\|');
    expect(process('```')).toEqual('\\`\\``');
    expect(process('    ')).toEqual('\\    ');
  });
  it('should escape leading markdown entities preceded by whitespace', () => {
    expect(process('\n #')).toEqual('\\#');
    expect(process(' \n-')).toEqual('\\-');
  });
  it('should not escape leading markdown entities preceded by non-whitespace characters', () => {
    expect(process('a# # b #')).toEqual('a# # b #');
    expect(process('a- - b -')).toEqual('a- - b -');
  });
  it('should not escape html tags', () => {
    expect(process('<a attr="**a**">')).toEqual('<a attr="**a**">');
    expect(process('a b <c attr="**d**"> e')).toEqual('a b <c attr="**d**"> e');
  });
  it('should escape the contents of html blocks', () => {
    expect(process('<div>*a*</div>')).toEqual('<div>\\*a\\*</div>');
  });
  it('should not escape the contents of preformatted html blocks', () => {
    expect(process('<pre>*a*</pre>')).toEqual('<pre>*a*</pre>');
    expect(process('<script>*a*</script>')).toEqual('<script>*a*</script>');
    expect(process('<style>*a*</style>')).toEqual('<style>*a*</style>');
    expect(process('<pre>\n*a*\n</pre>')).toEqual('<pre>\n*a*\n</pre>');
    expect(process('a b <pre>*c*</pre> d e')).toEqual('a b <pre>*c*</pre> d e');
  });
  it('should not parse footnotes', () => {
    expect(process('[^a]')).toEqual('\\[^a]');
  });
});