"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _curry = _interopRequireDefault(require("lodash/curry"));

var _flow = _interopRequireDefault(require("lodash/flow"));

var _isString = _interopRequireDefault(require("lodash/isString"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const decodeParams = paramsString => (0, _immutable.List)(paramsString.split('&')).map(s => (0, _immutable.List)(s.split('=')).map(decodeURIComponent)).update(_immutable.Map);

const fromURL = wholeURL => {
  const _wholeURL$split = wholeURL.split('?'),
        _wholeURL$split2 = _slicedToArray(_wholeURL$split, 2),
        url = _wholeURL$split2[0],
        allParamsString = _wholeURL$split2[1];

  return (0, _immutable.Map)(_objectSpread({
    url
  }, allParamsString ? {
    params: decodeParams(allParamsString)
  } : {}));
};

const encodeParams = params => params.entrySeq().map((_ref) => {
  let _ref2 = _slicedToArray(_ref, 2),
      k = _ref2[0],
      v = _ref2[1];

  return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
}).join('&');

const toURL = req => `${req.get('url')}${req.get('params') ? `?${encodeParams(req.get('params'))}` : ''}`;

const toFetchArguments = req => [toURL(req), req.delete('url').delete('params').toJS()];

const maybeRequestArg = req => {
  if ((0, _isString.default)(req)) {
    return fromURL(req);
  }

  if (req) {
    return (0, _immutable.fromJS)(req);
  }

  return (0, _immutable.Map)();
};

const ensureRequestArg = func => req => func(maybeRequestArg(req));

const ensureRequestArg2 = func => (arg, req) => func(arg, maybeRequestArg(req)); // This actually performs the built request object


const performRequest = ensureRequestArg(req => fetch(...toFetchArguments(req))); // Each of the following functions takes options and returns another
// function that performs the requested action on a request. They each
// default to containing an empty object, so you can simply call them
// without arguments to generate a request with only those properties.

const getCurriedRequestProcessor = (0, _flow.default)([ensureRequestArg2, _curry.default]);

const getPropSetFunctions = path => [getCurriedRequestProcessor((val, req) => req.setIn(path, val)), getCurriedRequestProcessor((val, req) => req.getIn(path) ? req : req.setIn(path, val))];

const getPropMergeFunctions = path => [getCurriedRequestProcessor((obj, req) => req.updateIn(path, function () {
  let p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)();
  return p.merge(obj);
})), getCurriedRequestProcessor((obj, req) => req.updateIn(path, function () {
  let p = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)();
  return (0, _immutable.Map)(obj).merge(p);
}))];

const _getPropSetFunctions = getPropSetFunctions(['method']),
      _getPropSetFunctions2 = _slicedToArray(_getPropSetFunctions, 2),
      withMethod = _getPropSetFunctions2[0],
      withDefaultMethod = _getPropSetFunctions2[1];

const _getPropSetFunctions3 = getPropSetFunctions(['body']),
      _getPropSetFunctions4 = _slicedToArray(_getPropSetFunctions3, 2),
      withBody = _getPropSetFunctions4[0],
      withDefaultBody = _getPropSetFunctions4[1];

const _getPropMergeFunction = getPropMergeFunctions(['params']),
      _getPropMergeFunction2 = _slicedToArray(_getPropMergeFunction, 2),
      withParams = _getPropMergeFunction2[0],
      withDefaultParams = _getPropMergeFunction2[1];

const _getPropMergeFunction3 = getPropMergeFunctions(['headers']),
      _getPropMergeFunction4 = _slicedToArray(_getPropMergeFunction3, 2),
      withHeaders = _getPropMergeFunction4[0],
      withDefaultHeaders = _getPropMergeFunction4[1]; // withRoot sets a root URL, unless the URL is already absolute


const absolutePath = new RegExp('^(?:[a-z]+:)?//', 'i');
const withRoot = getCurriedRequestProcessor((root, req) => req.update('url', p => {
  if (absolutePath.test(p)) {
    return p;
  }

  return root && p && p[0] !== '/' && root[root.length - 1] !== '/' ? `${root}/${p}` : `${root}${p}`;
})); // withTimestamp needs no argument and has to run as late as possible,
// so it calls `withParams` only when it's actually called with a
// request.

const withTimestamp = ensureRequestArg(req => withParams({
  ts: new Date().getTime()
}, req));
var _default = {
  toURL,
  fromURL,
  performRequest,
  withMethod,
  withDefaultMethod,
  withBody,
  withDefaultBody,
  withHeaders,
  withDefaultHeaders,
  withParams,
  withDefaultParams,
  withRoot,
  withTimestamp
};
exports.default = _default;