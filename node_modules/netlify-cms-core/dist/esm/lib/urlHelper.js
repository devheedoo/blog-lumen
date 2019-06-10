"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCollectionUrl = getCollectionUrl;
exports.getNewEntryUrl = getNewEntryUrl;
exports.addParams = addParams;
exports.stripProtocol = stripProtocol;
exports.sanitizeURI = sanitizeURI;
exports.sanitizeSlug = sanitizeSlug;

var _partialRight2 = _interopRequireDefault(require("lodash/partialRight"));

var _flow2 = _interopRequireDefault(require("lodash/flow"));

var _escapeRegExp2 = _interopRequireDefault(require("lodash/escapeRegExp"));

var _isString2 = _interopRequireDefault(require("lodash/isString"));

var _url = _interopRequireDefault(require("url"));

var _diacritics = _interopRequireDefault(require("diacritics"));

var _sanitizeFilename = _interopRequireDefault(require("sanitize-filename"));

var _immutable = require("immutable");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getUrl(urlString, direct) {
  return `${direct ? '/#' : ''}${urlString}`;
}

function getCollectionUrl(collectionName, direct) {
  return getUrl(`/collections/${collectionName}`, direct);
}

function getNewEntryUrl(collectionName, direct) {
  return getUrl(`/collections/${collectionName}/new`, direct);
}

function addParams(urlString, params) {
  const parsedUrl = _url.default.parse(urlString, true);

  parsedUrl.query = _objectSpread({}, parsedUrl.query, params);
  return _url.default.format(parsedUrl);
}

function stripProtocol(urlString) {
  const protocolEndIndex = urlString.indexOf('//');
  return protocolEndIndex > -1 ? urlString.slice(protocolEndIndex + 2) : urlString;
}
/* See https://www.w3.org/International/articles/idn-and-iri/#path.
 * According to the new IRI (Internationalized Resource Identifier) spec, RFC 3987,
 *   ASCII chars should be kept the same way as in standard URIs (letters digits _ - . ~).
 * Non-ASCII chars (unless they are not in the allowed "ucschars" list) should be percent-encoded.
 * If the string is not encoded in Unicode, it should be converted to UTF-8 and normalized first,
 *   but JS stores strings as UTF-16/UCS-2 internally, so we should not normallize or re-encode.
 */


const uriChars = /[\w\-.~]/i;
const ucsChars = /(?:[\xA0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[\uD800-\uD83E\uD840-\uD87E\uD880-\uD8BE\uD8C0-\uD8FE\uD900-\uD93E\uD940-\uD97E\uD980-\uD9BE\uD9C0-\uD9FE\uDA00-\uDA3E\uDA40-\uDA7E\uDA80-\uDABE\uDAC0-\uDAFE\uDB00-\uDB3E\uDB44-\uDB7E][\uDC00-\uDFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F][\uDC00-\uDFFD])/;

const validURIChar = char => uriChars.test(char);

const validIRIChar = char => uriChars.test(char) || ucsChars.test(char); // `sanitizeURI` does not actually URI-encode the chars (that is the browser's and server's job), just removes the ones that are not allowed.


function sanitizeURI(str) {
  let _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$replacement = _ref.replacement,
      replacement = _ref$replacement === void 0 ? '' : _ref$replacement,
      _ref$encoding = _ref.encoding,
      encoding = _ref$encoding === void 0 ? 'unicode' : _ref$encoding;

  if (!(0, _isString2.default)(str)) {
    throw new Error('The input slug must be a string.');
  }

  if (!(0, _isString2.default)(replacement)) {
    throw new Error('`options.replacement` must be a string.');
  }

  let validChar;

  if (encoding === 'unicode') {
    validChar = validIRIChar;
  } else if (encoding === 'ascii') {
    validChar = validURIChar;
  } else {
    throw new Error('`options.encoding` must be "unicode" or "ascii".');
  } // Check and make sure the replacement character is actually a safe char itself.


  if (!Array.from(replacement).every(validChar)) {
    throw new Error('The replacement character(s) (options.replacement) is itself unsafe.');
  } // `Array.from` must be used instead of `String.split` because
  //   `split` converts things like emojis into UTF-16 surrogate pairs.


  return Array.from(str).map(char => validChar(char) ? char : replacement).join('');
}

function sanitizeSlug(str) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _immutable.Map)();
  const encoding = options.get('encoding', 'unicode');
  const stripDiacritics = options.get('clean_accents', false);
  const replacement = options.get('sanitize_replacement', '-');

  if (!(0, _isString2.default)(str)) {
    throw new Error('The input slug must be a string.');
  }

  const sanitizedSlug = (0, _flow2.default)([...(stripDiacritics ? [_diacritics.default.remove] : []), (0, _partialRight2.default)(sanitizeURI, {
    replacement,
    encoding
  }), (0, _partialRight2.default)(_sanitizeFilename.default, {
    replacement
  })])(str); // Remove any doubled or leading/trailing replacement characters (that were added in the sanitizers).

  const doubleReplacement = new RegExp(`(?:${(0, _escapeRegExp2.default)(replacement)})+`, 'g');
  const trailingReplacment = new RegExp(`${(0, _escapeRegExp2.default)(replacement)}$`);
  const leadingReplacment = new RegExp(`^${(0, _escapeRegExp2.default)(replacement)}`);
  const normalizedSlug = sanitizedSlug.replace(doubleReplacement, replacement).replace(leadingReplacment, '').replace(trailingReplacment, '');
  return normalizedSlug;
}