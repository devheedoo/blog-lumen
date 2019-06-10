"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get2 = _interopRequireDefault(require("lodash/get"));

var _flow2 = _interopRequireDefault(require("lodash/flow"));

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class API {
  constructor(config) {
    var _this = this;

    _defineProperty(this, "buildRequest", req => (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withRoot(this.api_root), _netlifyCmsLibUtil.unsentRequest.withTimestamp])(req));

    _defineProperty(this, "request", req => (0, _flow2.default)([this.buildRequest, this.requestFunction, p => p.catch(err => Promise.reject(new _netlifyCmsLibUtil.APIError(err.message, null, 'BitBucket')))])(req));

    _defineProperty(this, "requestJSON", req => (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withDefaultHeaders({
      'Content-Type': 'application/json'
    }), this.request, (0, _netlifyCmsLibUtil.then)((0, _netlifyCmsLibUtil.responseParser)({
      format: 'json'
    })), p => p.catch(err => Promise.reject(new _netlifyCmsLibUtil.APIError(err.message, null, 'BitBucket')))])(req));

    _defineProperty(this, "requestText", req => (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withDefaultHeaders({
      'Content-Type': 'text/plain'
    }), this.request, (0, _netlifyCmsLibUtil.then)((0, _netlifyCmsLibUtil.responseParser)({
      format: 'text'
    })), p => p.catch(err => Promise.reject(new _netlifyCmsLibUtil.APIError(err.message, null, 'BitBucket')))])(req));

    _defineProperty(this, "user", () => this.request('/user'));

    _defineProperty(this, "hasWriteAccess", async () => {
      const response = await this.request(this.repoURL);

      if (response.status === 404) {
        throw Error('Repo not found');
      }

      return response.ok;
    });

    _defineProperty(this, "isFile", (_ref) => {
      let type = _ref.type;
      return type === 'commit_file';
    });

    _defineProperty(this, "processFile", file => _objectSpread({}, file, {
      name: (0, _netlifyCmsLibUtil.basename)(file.path)
    }, file.commit && file.commit.hash ? {
      id: `${file.commit.hash}/${file.path}`
    } : {}));

    _defineProperty(this, "processFiles", files => files.filter(this.isFile).map(this.processFile));

    _defineProperty(this, "readFile", async function (path, sha) {
      let _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref2$ref = _ref2.ref,
          ref = _ref2$ref === void 0 ? _this.branch : _ref2$ref,
          _ref2$parseText = _ref2.parseText,
          parseText = _ref2$parseText === void 0 ? true : _ref2$parseText;

      const cacheKey = parseText ? `bb.${sha}` : `bb.${sha}.blob`;
      const cachedFile = sha ? await _netlifyCmsLibUtil.localForage.getItem(cacheKey) : null;

      if (cachedFile) {
        return cachedFile;
      }

      const result = await _this.request({
        url: `${_this.repoURL}/src/${ref}/${path}`,
        cache: 'no-store'
      }).then(parseText ? (0, _netlifyCmsLibUtil.responseParser)({
        format: 'text'
      }) : (0, _netlifyCmsLibUtil.responseParser)({
        format: 'blob'
      }));

      if (sha) {
        _netlifyCmsLibUtil.localForage.setItem(cacheKey, result);
      }

      return result;
    });

    _defineProperty(this, "getEntriesAndCursor", jsonResponse => {
      const count = jsonResponse.size,
            index = jsonResponse.page,
            pageSize = jsonResponse.pagelen,
            next = jsonResponse.next,
            prev = jsonResponse.previous,
            entries = jsonResponse.values;
      const pageCount = pageSize && count ? Math.ceil(count / pageSize) : undefined;
      return {
        entries,
        cursor: _netlifyCmsLibUtil.Cursor.create({
          actions: [...(next ? ['next'] : []), ...(prev ? ['prev'] : [])],
          meta: {
            index,
            count,
            pageSize,
            pageCount
          },
          data: {
            links: {
              next,
              prev
            }
          }
        })
      };
    });

    _defineProperty(this, "listFiles", async path => {
      const _ref3 = await (0, _flow2.default)([// sort files by filename ascending
      _netlifyCmsLibUtil.unsentRequest.withParams({
        sort: '-path'
      }), this.requestJSON, (0, _netlifyCmsLibUtil.then)(this.getEntriesAndCursor)])(`${this.repoURL}/src/${this.branch}/${path}`),
            entries = _ref3.entries,
            cursor = _ref3.cursor;

      return {
        entries: this.processFiles(entries),
        cursor
      };
    });

    _defineProperty(this, "traverseCursor", async (cursor, action) => (0, _flow2.default)([this.requestJSON, (0, _netlifyCmsLibUtil.then)(this.getEntriesAndCursor), (0, _netlifyCmsLibUtil.then)((_ref4) => {
      let newCursor = _ref4.cursor,
          entries = _ref4.entries;
      return {
        cursor: newCursor,
        entries: this.processFiles(entries)
      };
    })])(cursor.data.getIn(['links', action])));

    _defineProperty(this, "listAllFiles", async path => {
      const _ref5 = await this.listFiles(path),
            initialCursor = _ref5.cursor,
            initialEntries = _ref5.entries;

      const entries = [...initialEntries];
      let currentCursor = initialCursor;

      while (currentCursor && currentCursor.actions.has('next')) {
        const _ref6 = await this.traverseCursor(currentCursor, 'next'),
              newCursor = _ref6.cursor,
              newEntries = _ref6.entries;

        entries.push(...newEntries);
        currentCursor = newCursor;
      }

      return this.processFiles(entries);
    });

    _defineProperty(this, "uploadBlob", async function (item) {
      let _ref7 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          commitMessage = _ref7.commitMessage,
          _ref7$branch = _ref7.branch,
          branch = _ref7$branch === void 0 ? _this.branch : _ref7$branch;

      const contentBlob = (0, _get2.default)(item, 'fileObj', new Blob([item.raw]));
      const formData = new FormData(); // Third param is filename header, in case path is `message`, `branch`, etc.

      formData.append(item.path, contentBlob, (0, _netlifyCmsLibUtil.basename)(item.path));
      formData.append('branch', branch);

      if (commitMessage) {
        formData.append('message', commitMessage);
      }

      if (_this.commitAuthor) {
        const _this$commitAuthor = _this.commitAuthor,
              name = _this$commitAuthor.name,
              email = _this$commitAuthor.email;
        formData.append('author', `${name} <${email}>`);
      }

      return (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withMethod('POST'), _netlifyCmsLibUtil.unsentRequest.withBody(formData), _this.request, (0, _netlifyCmsLibUtil.then)(() => _objectSpread({}, item, {
        uploaded: true
      }))])(`${_this.repoURL}/src`);
    });

    _defineProperty(this, "persistFiles", (files, _ref8) => {
      let commitMessage = _ref8.commitMessage;
      return Promise.all(files.filter((_ref9) => {
        let uploaded = _ref9.uploaded;
        return !uploaded;
      }).map(file => this.uploadBlob(file, {
        commitMessage
      })));
    });

    _defineProperty(this, "deleteFile", function (path, message) {
      let _ref10 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          _ref10$branch = _ref10.branch,
          branch = _ref10$branch === void 0 ? _this.branch : _ref10$branch;

      const body = new FormData();
      body.append('files', path);
      body.append('branch', branch);

      if (message) {
        body.append('message', message);
      }

      if (_this.commitAuthor) {
        const _this$commitAuthor2 = _this.commitAuthor,
              name = _this$commitAuthor2.name,
              email = _this$commitAuthor2.email;
        body.append('author', `${name} <${email}>`);
      }

      return (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withMethod('POST'), _netlifyCmsLibUtil.unsentRequest.withBody(body), _this.request])(`${_this.repoURL}/src`);
    });

    this.api_root = config.api_root || 'https://api.bitbucket.org/2.0';
    this.branch = config.branch || 'master';
    this.repo = config.repo || '';
    this.requestFunction = config.requestFunction || _netlifyCmsLibUtil.unsentRequest.performRequest; // Allow overriding this.hasWriteAccess

    this.hasWriteAccess = config.hasWriteAccess || this.hasWriteAccess;
    this.repoURL = this.repo ? `/repositories/${this.repo}` : '';
  }

}

exports.default = API;