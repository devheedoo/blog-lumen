"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClient = exports.matchPath = exports.getLargeMediaPatternsFromGitAttributesFile = exports.createPointerFile = exports.parsePointerFile = void 0;

var _map2 = _interopRequireDefault(require("lodash/fp/map"));

var _fromPairs2 = _interopRequireDefault(require("lodash/fp/fromPairs"));

var _flow2 = _interopRequireDefault(require("lodash/fp/flow"));

var _filter2 = _interopRequireDefault(require("lodash/fp/filter"));

var _minimatch = _interopRequireDefault(require("minimatch"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

//
// Pointer file parsing
const splitIntoLines = str => str.split('\n');

const splitIntoWords = str => str.split(/\s+/g);

const isNonEmptyString = str => str !== '';

const withoutEmptyLines = (0, _flow2.default)([(0, _map2.default)(str => str.trim()), (0, _filter2.default)(isNonEmptyString)]);
const parsePointerFile = (0, _flow2.default)([splitIntoLines, withoutEmptyLines, (0, _map2.default)(splitIntoWords), _fromPairs2.default, (_ref) => {
  let size = _ref.size,
      oid = _ref.oid,
      rest = _objectWithoutProperties(_ref, ["size", "oid"]);

  return _objectSpread({
    size: parseInt(size),
    sha: oid.split(':')[1]
  }, rest);
}]);
exports.parsePointerFile = parsePointerFile;

const createPointerFile = (_ref2) => {
  let size = _ref2.size,
      sha = _ref2.sha;
  return `\
version https://git-lfs.github.com/spec/v1
oid sha256:${sha}
size ${size}
`;
}; //
// .gitattributes file parsing


exports.createPointerFile = createPointerFile;

const removeGitAttributesCommentsFromLine = line => line.split('#')[0];

const parseGitPatternAttribute = attributeString => {
  // There are three kinds of attribute settings:
  // - a key=val pair sets an attribute to a specific value
  // - a key without a value and a leading hyphen sets an attribute to false
  // - a key without a value and no leading hyphen sets an attribute
  //   to true
  if (attributeString.includes('=')) {
    return attributeString.split('=');
  }

  if (attributeString.startsWith('-')) {
    return [attributeString.slice(1), false];
  }

  return [attributeString, true];
};

const parseGitPatternAttributes = (0, _flow2.default)([(0, _map2.default)(parseGitPatternAttribute), _fromPairs2.default]);
const parseGitAttributesPatternLine = (0, _flow2.default)([splitIntoWords, (_ref3) => {
  let _ref4 = _toArray(_ref3),
      pattern = _ref4[0],
      attributes = _ref4.slice(1);

  return [pattern, parseGitPatternAttributes(attributes)];
}]);
const parseGitAttributesFileToPatternAttributePairs = (0, _flow2.default)([splitIntoLines, (0, _map2.default)(removeGitAttributesCommentsFromLine), withoutEmptyLines, (0, _map2.default)(parseGitAttributesPatternLine)]);
const getLargeMediaPatternsFromGitAttributesFile = (0, _flow2.default)([parseGitAttributesFileToPatternAttributePairs, (0, _filter2.default)( // eslint-disable-next-line no-unused-vars
(_ref5) => {
  let _ref6 = _slicedToArray(_ref5, 2),
      pattern = _ref6[0],
      attributes = _ref6[1];

  return attributes.filter === 'lfs' && attributes.diff === 'lfs' && attributes.merge === 'lfs';
}), (0, _map2.default)((_ref7) => {
  let _ref8 = _slicedToArray(_ref7, 1),
      pattern = _ref8[0];

  return pattern;
})]);
exports.getLargeMediaPatternsFromGitAttributesFile = getLargeMediaPatternsFromGitAttributesFile;

const matchPath = (_ref9, path) => {
  let patterns = _ref9.patterns;
  return patterns.some(pattern => (0, _minimatch.default)(path, pattern, {
    matchBase: true
  }));
}; //
// API interactions


exports.matchPath = matchPath;
const defaultContentHeaders = {
  Accept: 'application/vnd.git-lfs+json',
  ['Content-Type']: 'application/vnd.git-lfs+json'
};

const resourceExists = async (_ref10, _ref11) => {
  let rootURL = _ref10.rootURL,
      makeAuthorizedRequest = _ref10.makeAuthorizedRequest;
  let sha = _ref11.sha,
      size = _ref11.size;
  const response = await makeAuthorizedRequest({
    url: `${rootURL}/verify`,
    method: 'POST',
    headers: defaultContentHeaders,
    body: JSON.stringify({
      oid: sha,
      size
    })
  });

  if (response.ok) {
    return true;
  }

  if (response.status === 404) {
    return false;
  } // TODO: what kind of error to throw here? APIError doesn't seem
  // to fit

};

const getDownloadURL = (_ref12, _ref13) => {
  let rootURL = _ref12.rootURL,
      t = _ref12.transformImages,
      makeAuthorizedRequest = _ref12.makeAuthorizedRequest;
  let sha = _ref13.sha;
  return makeAuthorizedRequest(`${rootURL}/origin/${sha}${t && Object.keys(t).length > 0 ? `?nf_resize=${t.nf_resize}&w=${t.w}&h=${t.h}` : ''}`).then(res => res.ok ? res : Promise.reject(res)).then(res => res.blob()).then(blob => URL.createObjectURL(blob)).catch(err => console.error(err) || Promise.resolve(''));
};

const getResourceDownloadURLArgs = (clientConfig, objects) => {
  return Promise.resolve(objects.map((_ref14) => {
    let sha = _ref14.sha;
    return [sha, {
      sha
    }];
  }));
};

const getResourceDownloadURLs = (clientConfig, objects) => getResourceDownloadURLArgs(clientConfig, objects).then((0, _map2.default)(downloadURLArg => getDownloadURL(downloadURLArg))).then(Promise.all.bind(Promise));

const uploadOperation = objects => ({
  operation: 'upload',
  transfers: ['basic'],
  objects: objects.map((_ref15) => {
    let sha = _ref15.sha,
        rest = _objectWithoutProperties(_ref15, ["sha"]);

    return _objectSpread({}, rest, {
      oid: sha
    });
  })
});

const getResourceUploadURLs = async (_ref16, objects) => {
  let rootURL = _ref16.rootURL,
      makeAuthorizedRequest = _ref16.makeAuthorizedRequest;
  const response = await makeAuthorizedRequest({
    url: `${rootURL}/objects/batch`,
    method: 'POST',
    headers: defaultContentHeaders,
    body: JSON.stringify(uploadOperation(objects))
  });
  return (await response.json()).objects.map(object => {
    if (object.error) {
      throw new Error(object.error.message);
    }

    return object.actions.upload.href;
  });
};

const uploadBlob = (clientConfig, uploadURL, blob) => fetch(uploadURL, {
  method: 'PUT',
  body: blob
});

const uploadResource = async (clientConfig, _ref17, resource) => {
  let sha = _ref17.sha,
      size = _ref17.size;
  const existingFile = await resourceExists(clientConfig, {
    sha,
    size
  });

  if (existingFile) {
    return sha;
  }

  const _ref18 = await getResourceUploadURLs(clientConfig, [{
    sha,
    size
  }]),
        _ref19 = _slicedToArray(_ref18, 1),
        uploadURL = _ref19[0];

  await uploadBlob(clientConfig, uploadURL, resource);
  return sha;
}; //
// Create Large Media client


const configureFn = (config, fn) => function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return fn(config, ...args);
};

const clientFns = {
  resourceExists,
  getResourceUploadURLs,
  getResourceDownloadURLs,
  getResourceDownloadURLArgs,
  getDownloadURL,
  uploadResource,
  matchPath
};

const getClient = clientConfig => {
  return (0, _flow2.default)([Object.keys, (0, _map2.default)(key => [key, configureFn(clientConfig, clientFns[key])]), _fromPairs2.default, configuredFns => _objectSpread({}, configuredFns, {
    patterns: clientConfig.patterns,
    enabled: clientConfig.enabled
  })])(clientFns);
};

exports.getClient = getClient;