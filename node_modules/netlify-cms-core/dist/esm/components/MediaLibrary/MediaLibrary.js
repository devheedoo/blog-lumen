"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map2 = _interopRequireDefault(require("lodash/map"));

var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _reactRedux = require("react-redux");

var _reactPolyglot = require("react-polyglot");

var _fuzzy = _interopRequireDefault(require("fuzzy"));

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

var _mediaLibrary = require("../../actions/mediaLibrary");

var _MediaLibraryModal = _interopRequireDefault(require("./MediaLibraryModal"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Extensions used to determine which files to show when the media library is
 * accessed from an image insertion field.
 */
const IMAGE_EXTENSIONS_VIEWABLE = ['jpg', 'jpeg', 'webp', 'gif', 'png', 'bmp', 'tiff', 'svg'];
const IMAGE_EXTENSIONS = [...IMAGE_EXTENSIONS_VIEWABLE];
const fileShape = {
  displayURL: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  id: _propTypes.default.string.isRequired,
  key: _propTypes.default.string.isRequired,
  name: _propTypes.default.string.isRequired,
  queryOrder: _propTypes.default.number,
  size: _propTypes.default.number,
  url: _propTypes.default.string,
  urlIsPublicPath: _propTypes.default.bool
};

class MediaLibrary extends _react.default.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "state", {
      selectedFile: {},
      query: ''
    });

    _defineProperty(this, "loadDisplayURL", file => {
      const loadMediaDisplayURL = this.props.loadMediaDisplayURL;
      loadMediaDisplayURL(file);
    });

    _defineProperty(this, "filterImages", files => {
      return files.filter(file => {
        const ext = (0, _netlifyCmsLibUtil.fileExtension)(file.name).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      });
    });

    _defineProperty(this, "toTableData", files => {
      const tableData = files && files.map((_ref) => {
        let key = _ref.key,
            name = _ref.name,
            id = _ref.id,
            size = _ref.size,
            queryOrder = _ref.queryOrder,
            url = _ref.url,
            urlIsPublicPath = _ref.urlIsPublicPath,
            displayURL = _ref.displayURL;
        const ext = (0, _netlifyCmsLibUtil.fileExtension)(name).toLowerCase();
        return {
          key,
          id,
          name,
          type: ext.toUpperCase(),
          size,
          queryOrder,
          url,
          urlIsPublicPath,
          displayURL,
          isImage: IMAGE_EXTENSIONS.includes(ext),
          isViewableImage: IMAGE_EXTENSIONS_VIEWABLE.includes(ext)
        };
      });
      /**
       * Get the sort order for use with `lodash.orderBy`, and always add the
       * `queryOrder` sort as the lowest priority sort order.
       */

      const sortFields = this.state.sortFields;
      const fieldNames = (0, _map2.default)(sortFields, 'fieldName').concat('queryOrder');
      const directions = (0, _map2.default)(sortFields, 'direction').concat('asc');
      return (0, _orderBy2.default)(tableData, fieldNames, directions);
    });

    _defineProperty(this, "handleClose", () => {
      this.props.closeMediaLibrary();
    });

    _defineProperty(this, "handleAssetClick", asset => {
      const selectedFile = this.state.selectedFile.key === asset.key ? {} : asset;
      this.setState({
        selectedFile
      });
    });

    _defineProperty(this, "handlePersist", async event => {
      /**
       * Stop the browser from automatically handling the file input click, and
       * get the file for upload, and retain the synthetic event for access after
       * the asynchronous persist operation.
       */
      event.stopPropagation();
      event.preventDefault();
      event.persist();
      const _this$props = this.props,
            persistMedia = _this$props.persistMedia,
            privateUpload = _this$props.privateUpload;

      const _ref2 = event.dataTransfer || event.target,
            fileList = _ref2.files;

      const files = [...fileList];
      const file = files[0];
      await persistMedia(file, {
        privateUpload
      });
      event.target.value = null;
      this.scrollToTop();
    });

    _defineProperty(this, "handleInsert", () => {
      const selectedFile = this.state.selectedFile;
      const name = selectedFile.name,
            url = selectedFile.url,
            urlIsPublicPath = selectedFile.urlIsPublicPath;
      const _this$props2 = this.props,
            insertMedia = _this$props2.insertMedia,
            publicFolder = _this$props2.publicFolder;
      const publicPath = urlIsPublicPath ? url : (0, _netlifyCmsLibUtil.resolvePath)(name, publicFolder);
      insertMedia(publicPath);
      this.handleClose();
    });

    _defineProperty(this, "handleDelete", () => {
      const selectedFile = this.state.selectedFile;
      const _this$props3 = this.props,
            files = _this$props3.files,
            deleteMedia = _this$props3.deleteMedia,
            privateUpload = _this$props3.privateUpload,
            t = _this$props3.t;

      if (!window.confirm(t('mediaLibrary.mediaLibrary.onDelete'))) {
        return;
      }

      const file = files.find(file => selectedFile.key === file.key);
      deleteMedia(file, {
        privateUpload
      }).then(() => {
        this.setState({
          selectedFile: {}
        });
      });
    });

    _defineProperty(this, "handleLoadMore", () => {
      const _this$props4 = this.props,
            loadMedia = _this$props4.loadMedia,
            dynamicSearchQuery = _this$props4.dynamicSearchQuery,
            page = _this$props4.page,
            privateUpload = _this$props4.privateUpload;
      loadMedia({
        query: dynamicSearchQuery,
        page: page + 1,
        privateUpload
      });
    });

    _defineProperty(this, "handleSearchKeyDown", async event => {
      const _this$props5 = this.props,
            dynamicSearch = _this$props5.dynamicSearch,
            loadMedia = _this$props5.loadMedia,
            privateUpload = _this$props5.privateUpload;

      if (event.key === 'Enter' && dynamicSearch) {
        await loadMedia({
          query: this.state.query,
          privateUpload
        });
        this.scrollToTop();
      }
    });

    _defineProperty(this, "scrollToTop", () => {
      this.scrollContainerRef.scrollTop = 0;
    });

    _defineProperty(this, "handleSearchChange", event => {
      this.setState({
        query: event.target.value
      });
    });

    _defineProperty(this, "queryFilter", (query, files) => {
      /**
       * Because file names don't have spaces, typing a space eliminates all
       * potential matches, so we strip them all out internally before running the
       * query.
       */
      const strippedQuery = query.replace(/ /g, '');

      const matches = _fuzzy.default.filter(strippedQuery, files, {
        extract: file => file.name
      });

      const matchFiles = matches.map((match, queryIndex) => {
        const file = files[match.index];
        return _objectSpread({}, file, {
          queryIndex
        });
      });
      return matchFiles;
    });
  }

  componentDidMount() {
    this.props.loadMedia();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    /**
     * We clear old state from the media library when it's being re-opened
     * because, when doing so on close, the state is cleared while the media
     * library is still fading away.
     */
    const isOpening = !this.props.isVisible && nextProps.isVisible;

    if (isOpening) {
      this.setState({
        selectedFile: {},
        query: ''
      });
    }
  }

  componentDidUpdate(prevProps) {
    const isOpening = !prevProps.isVisible && this.props.isVisible;

    if (isOpening && prevProps.privateUpload !== this.props.privateUpload) {
      this.props.loadMedia({
        privateUpload: this.props.privateUpload
      });
    }
  }

  render() {
    const _this$props6 = this.props,
          isVisible = _this$props6.isVisible,
          canInsert = _this$props6.canInsert,
          files = _this$props6.files,
          dynamicSearch = _this$props6.dynamicSearch,
          dynamicSearchActive = _this$props6.dynamicSearchActive,
          forImage = _this$props6.forImage,
          isLoading = _this$props6.isLoading,
          isPersisting = _this$props6.isPersisting,
          isDeleting = _this$props6.isDeleting,
          hasNextPage = _this$props6.hasNextPage,
          isPaginating = _this$props6.isPaginating,
          privateUpload = _this$props6.privateUpload,
          displayURLs = _this$props6.displayURLs,
          t = _this$props6.t;
    return _react.default.createElement(_MediaLibraryModal.default, {
      isVisible: isVisible,
      canInsert: canInsert,
      files: files,
      dynamicSearch: dynamicSearch,
      dynamicSearchActive: dynamicSearchActive,
      forImage: forImage,
      isLoading: isLoading,
      isPersisting: isPersisting,
      isDeleting: isDeleting,
      hasNextPage: hasNextPage,
      isPaginating: isPaginating,
      privateUpload: privateUpload,
      query: this.state.query,
      selectedFile: this.state.selectedFile,
      handleFilter: this.filterImages,
      handleQuery: this.queryFilter,
      toTableData: this.toTableData,
      handleClose: this.handleClose,
      handleSearchChange: this.handleSearchChange,
      handleSearchKeyDown: this.handleSearchKeyDown,
      handlePersist: this.handlePersist,
      handleDelete: this.handleDelete,
      handleInsert: this.handleInsert,
      setScrollContainerRef: ref => this.scrollContainerRef = ref,
      handleAssetClick: this.handleAssetClick,
      handleLoadMore: this.handleLoadMore,
      displayURLs: displayURLs,
      loadDisplayURL: this.loadDisplayURL,
      t: t
    });
  }

}

_defineProperty(MediaLibrary, "propTypes", {
  isVisible: _propTypes.default.bool,
  loadMediaDisplayURL: _propTypes.default.func,
  displayURLs: _reactImmutableProptypes.default.map,
  canInsert: _propTypes.default.bool,
  files: _propTypes.default.arrayOf(_propTypes.default.shape(fileShape)).isRequired,
  dynamicSearch: _propTypes.default.bool,
  dynamicSearchActive: _propTypes.default.bool,
  forImage: _propTypes.default.bool,
  isLoading: _propTypes.default.bool,
  isPersisting: _propTypes.default.bool,
  isDeleting: _propTypes.default.bool,
  hasNextPage: _propTypes.default.bool,
  isPaginating: _propTypes.default.bool,
  privateUpload: _propTypes.default.bool,
  loadMedia: _propTypes.default.func.isRequired,
  dynamicSearchQuery: _propTypes.default.string,
  page: _propTypes.default.number,
  persistMedia: _propTypes.default.func.isRequired,
  deleteMedia: _propTypes.default.func.isRequired,
  insertMedia: _propTypes.default.func.isRequired,
  publicFolder: _propTypes.default.string,
  closeMediaLibrary: _propTypes.default.func.isRequired,
  t: _propTypes.default.func.isRequired
});

_defineProperty(MediaLibrary, "defaultProps", {
  files: []
});

const mapStateToProps = state => {
  const config = state.config,
        mediaLibrary = state.mediaLibrary;
  const configProps = {
    publicFolder: config.get('public_folder')
  };
  const mediaLibraryProps = {
    isVisible: mediaLibrary.get('isVisible'),
    canInsert: mediaLibrary.get('canInsert'),
    files: mediaLibrary.get('files'),
    displayURLs: mediaLibrary.get('displayURLs'),
    dynamicSearch: mediaLibrary.get('dynamicSearch'),
    dynamicSearchActive: mediaLibrary.get('dynamicSearchActive'),
    dynamicSearchQuery: mediaLibrary.get('dynamicSearchQuery'),
    forImage: mediaLibrary.get('forImage'),
    isLoading: mediaLibrary.get('isLoading'),
    isPersisting: mediaLibrary.get('isPersisting'),
    isDeleting: mediaLibrary.get('isDeleting'),
    privateUpload: mediaLibrary.get('privateUpload'),
    page: mediaLibrary.get('page'),
    hasNextPage: mediaLibrary.get('hasNextPage'),
    isPaginating: mediaLibrary.get('isPaginating')
  };
  return _objectSpread({}, configProps, mediaLibraryProps);
};

const mapDispatchToProps = {
  loadMedia: _mediaLibrary.loadMedia,
  persistMedia: _mediaLibrary.persistMedia,
  deleteMedia: _mediaLibrary.deleteMedia,
  insertMedia: _mediaLibrary.insertMedia,
  loadMediaDisplayURL: _mediaLibrary.loadMediaDisplayURL,
  closeMediaLibrary: _mediaLibrary.closeMediaLibrary
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)((0, _reactPolyglot.translate)()(MediaLibrary));

exports.default = _default;