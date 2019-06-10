"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _trimStart2 = _interopRequireDefault(require("lodash/trimStart"));

var _flow2 = _interopRequireDefault(require("lodash/flow"));

var _semaphore = _interopRequireDefault(require("semaphore"));

var _commonTags = require("common-tags");

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

var _netlifyCmsLibAuth = require("netlify-cms-lib-auth");

var _AuthenticationPage = _interopRequireDefault(require("./AuthenticationPage"));

var _API = _interopRequireDefault(require("./API"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const MAX_CONCURRENT_DOWNLOADS = 10; // Implementation wrapper class

class BitbucketBackend {
  constructor(config) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _defineProperty(this, "apiRequestFunction", async req => {
      const token = this.refreshedTokenPromise ? await this.refreshedTokenPromise : this.token;
      return (0, _flow2.default)([_netlifyCmsLibUtil.unsentRequest.withHeaders({
        Authorization: `Bearer ${token}`
      }), _netlifyCmsLibUtil.unsentRequest.performRequest, (0, _netlifyCmsLibUtil.then)(async res => {
        if (res.status === 401) {
          const json = await res.json().catch(() => null);

          if (json && json.type === 'error' && /^access token expired/i.test(json.error.message)) {
            const newToken = await this.getRefreshedAccessToken();

            const reqWithNewToken = _netlifyCmsLibUtil.unsentRequest.withHeaders({
              Authorization: `Bearer ${newToken}`
            }, req);

            return _netlifyCmsLibUtil.unsentRequest.performRequest(reqWithNewToken);
          }
        }

        return res;
      })])(req);
    });

    _defineProperty(this, "fetchFiles", files => {
      const sem = (0, _semaphore.default)(MAX_CONCURRENT_DOWNLOADS);
      const promises = [];
      files.forEach(file => {
        promises.push(new Promise(resolve => sem.take(() => this.api.readFile(file.path, file.id).then(data => {
          resolve({
            file,
            data
          });
          sem.leave();
        }).catch(function () {
          let error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
          sem.leave();
          console.error(`failed to load file from BitBucket: ${file.path}`);
          resolve({
            error
          });
        }))));
      });
      return Promise.all(promises).then(loadedEntries => loadedEntries.filter(loadedEntry => !loadedEntry.error));
    });

    this.config = config;
    this.options = _objectSpread({
      proxied: false,
      API: null,
      updateUserCredentials: async () => null
    }, options);

    if (this.options.useWorkflow) {
      throw new Error('The BitBucket backend does not support the Editorial Workflow.');
    }

    if (!this.options.proxied && !config.getIn(['backend', 'repo'], false)) {
      throw new Error('The BitBucket backend needs a "repo" in the backend configuration.');
    }

    this.api = this.options.API || null;
    this.updateUserCredentials = this.options.updateUserCredentials;
    this.repo = config.getIn(['backend', 'repo'], '');
    this.branch = config.getIn(['backend', 'branch'], 'master');
    this.api_root = config.getIn(['backend', 'api_root'], 'https://api.bitbucket.org/2.0');
    this.base_url = config.get('base_url');
    this.site_id = config.get('site_id');
    this.token = '';
  }

  authComponent() {
    return _AuthenticationPage.default;
  }

  setUser(user) {
    this.token = user.token;
    this.api = new _API.default({
      requestFunction: this.apiRequestFunction,
      branch: this.branch,
      repo: this.repo
    });
  }

  restoreUser(user) {
    return this.authenticate(user);
  }

  async authenticate(state) {
    this.token = state.token;
    this.refreshToken = state.refresh_token;
    this.api = new _API.default({
      requestFunction: this.apiRequestFunction,
      branch: this.branch,
      repo: this.repo,
      api_root: this.api_root
    });
    const user = await this.api.user();
    const isCollab = await this.api.hasWriteAccess(user).catch(error => {
      error.message = _commonTags.stripIndent`
        Repo "${this.repo}" not found.

        Please ensure the repo information is spelled correctly.

        If the repo is private, make sure you're logged into a Bitbucket account with access.
      `;
      throw error;
    }); // Unauthorized user

    if (!isCollab) {
      throw new Error('Your BitBucket user account does not have access to this repo.');
    } // Autorized user


    return _objectSpread({}, user, {
      token: state.token,
      refresh_token: state.refresh_token
    });
  }

  getRefreshedAccessToken() {
    if (this.refreshedTokenPromise) {
      return this.refreshedTokenPromise;
    } // instantiating a new Authenticator on each refresh isn't ideal,


    if (!this.auth) {
      const cfg = {
        base_url: this.base_url,
        site_id: this.site_id
      };
      this.authenticator = new _netlifyCmsLibAuth.NetlifyAuthenticator(cfg);
    }

    this.refreshedTokenPromise = this.authenticator.refresh({
      provider: 'bitbucket',
      refresh_token: this.refreshToken
    }).then((_ref) => {
      let token = _ref.token,
          refresh_token = _ref.refresh_token;
      this.token = token;
      this.refreshToken = refresh_token;
      this.refreshedTokenPromise = undefined;
      this.updateUserCredentials({
        token,
        refresh_token
      });
      return token;
    });
    return this.refreshedTokenPromise;
  }

  logout() {
    this.token = null;
    return;
  }

  getToken() {
    if (this.refreshedTokenPromise) {
      return this.refreshedTokenPromise;
    }

    return Promise.resolve(this.token);
  }

  entriesByFolder(collection, extension) {
    const listPromise = this.api.listFiles(collection.get('folder'));
    return (0, _netlifyCmsLibUtil.resolvePromiseProperties)({
      files: listPromise.then((_ref2) => {
        let entries = _ref2.entries;
        return entries;
      }).then((0, _netlifyCmsLibUtil.filterByPropExtension)(extension, 'path')).then(this.fetchFiles),
      cursor: listPromise.then((_ref3) => {
        let cursor = _ref3.cursor;
        return cursor;
      })
    }).then((_ref4) => {
      let files = _ref4.files,
          cursor = _ref4.cursor;
      files[_netlifyCmsLibUtil.CURSOR_COMPATIBILITY_SYMBOL] = cursor;
      return files;
    });
  }

  allEntriesByFolder(collection, extension) {
    return this.api.listAllFiles(collection.get('folder')).then((0, _netlifyCmsLibUtil.filterByPropExtension)(extension, 'path')).then(this.fetchFiles);
  }

  entriesByFiles(collection) {
    const files = collection.get('files').map(collectionFile => ({
      path: collectionFile.get('file'),
      label: collectionFile.get('label')
    }));
    return this.fetchFiles(files);
  }

  getEntry(collection, slug, path) {
    return this.api.readFile(path).then(data => ({
      file: {
        path
      },
      data
    }));
  }

  getMedia() {
    return this.api.listAllFiles(this.config.get('media_folder')).then(files => files.map((_ref5) => {
      let id = _ref5.id,
          name = _ref5.name,
          path = _ref5.path;
      return {
        id,
        name,
        path,
        displayURL: {
          id,
          path
        }
      };
    }));
  }

  getMediaDisplayURL(displayURL) {
    this._mediaDisplayURLSem = this._mediaDisplayURLSem || (0, _semaphore.default)(MAX_CONCURRENT_DOWNLOADS);
    const id = displayURL.id,
          path = displayURL.path;
    return new Promise((resolve, reject) => this._mediaDisplayURLSem.take(() => this.api.readFile(path, id, {
      parseText: false
    }).then(blob => URL.createObjectURL(blob)).then(resolve, reject).finally(() => this._mediaDisplayURLSem.leave())));
  }

  persistEntry(entry, mediaFiles) {
    let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    return this.api.persistFiles([entry], options);
  }

  async persistMedia(mediaFile) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    await this.api.persistFiles([mediaFile], options);
    const value = mediaFile.value,
          path = mediaFile.path,
          fileObj = mediaFile.fileObj;
    return {
      name: value,
      size: fileObj.size,
      path: (0, _trimStart2.default)(path, '/k')
    };
  }

  deleteFile(path, commitMessage, options) {
    return this.api.deleteFile(path, commitMessage, options);
  }

  traverseCursor(cursor, action) {
    return this.api.traverseCursor(cursor, action).then(async (_ref6) => {
      let entries = _ref6.entries,
          newCursor = _ref6.cursor;
      return {
        entries: await Promise.all(entries.map(file => this.api.readFile(file.path, file.id).then(data => ({
          file,
          data
        })))),
        cursor: newCursor
      };
    });
  }

}

exports.default = BitbucketBackend;