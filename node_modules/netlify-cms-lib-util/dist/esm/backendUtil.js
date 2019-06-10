"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseParser = exports.parseResponse = exports.filterByPropExtension = void 0;

var _get2 = _interopRequireDefault(require("lodash/get"));

var _immutable = require("immutable");

var _path = require("./path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const filterByPropExtension = (extension, propName) => arr => arr.filter(el => (0, _path.fileExtension)((0, _get2.default)(el, propName)) === extension);

exports.filterByPropExtension = filterByPropExtension;

const catchFormatErrors = (format, formatter) => res => {
  try {
    return formatter(res);
  } catch (err) {
    throw new Error(`Response cannot be parsed into the expected format (${format}): ${err.message}`);
  }
};

const responseFormatters = (0, _immutable.fromJS)({
  json: async res => {
    const contentType = res.headers.get('Content-Type');

    if (!contentType.startsWith('application/json') && !contentType.startsWith('text/json')) {
      throw new Error(`${contentType} is not a valid JSON Content-Type`);
    }

    return res.json();
  },
  text: async res => res.text(),
  blob: async res => res.blob()
}).mapEntries((_ref) => {
  let _ref2 = _slicedToArray(_ref, 2),
      format = _ref2[0],
      formatter = _ref2[1];

  return [format, catchFormatErrors(format, formatter)];
});

const parseResponse = async function parseResponse(res) {
  let _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref3$expectingOk = _ref3.expectingOk,
      expectingOk = _ref3$expectingOk === void 0 ? true : _ref3$expectingOk,
      _ref3$format = _ref3.format,
      format = _ref3$format === void 0 ? 'text' : _ref3$format;

  if (expectingOk && !res.ok) {
    throw new Error(`Expected an ok response, but received an error status: ${res.status}.`);
  }

  const formatter = responseFormatters.get(format, false);

  if (!formatter) {
    throw new Error(`${format} is not a supported response format.`);
  }

  const body = await formatter(res);
  return body;
};

exports.parseResponse = parseResponse;

const responseParser = options => res => parseResponse(res, options);

exports.responseParser = responseParser;