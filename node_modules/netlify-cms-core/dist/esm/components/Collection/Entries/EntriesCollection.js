"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _partial2 = _interopRequireDefault(require("lodash/partial"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _reactRedux = require("react-redux");

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

var _entries = require("../../../actions/entries");

var _reducers = require("../../../reducers");

var _cursors = require("../../../reducers/cursors");

var _Entries = _interopRequireDefault(require("./Entries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EntriesCollection extends _react.default.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleCursorActions", (cursor, action) => {
      const _this$props = this.props,
            collection = _this$props.collection,
            traverseCollectionCursor = _this$props.traverseCollectionCursor;
      traverseCollectionCursor(collection, action);
    });
  }

  componentDidMount() {
    const _this$props2 = this.props,
          collection = _this$props2.collection,
          entriesLoaded = _this$props2.entriesLoaded,
          loadEntries = _this$props2.loadEntries;

    if (collection && !entriesLoaded) {
      loadEntries(collection);
    }
  }

  componentDidUpdate(prevProps) {
    const _this$props3 = this.props,
          collection = _this$props3.collection,
          entriesLoaded = _this$props3.entriesLoaded,
          loadEntries = _this$props3.loadEntries;

    if (collection !== prevProps.collection && !entriesLoaded) {
      loadEntries(collection);
    }
  }

  render() {
    const _this$props4 = this.props,
          collection = _this$props4.collection,
          entries = _this$props4.entries,
          publicFolder = _this$props4.publicFolder,
          isFetching = _this$props4.isFetching,
          viewStyle = _this$props4.viewStyle,
          cursor = _this$props4.cursor;
    return _react.default.createElement(_Entries.default, {
      collections: collection,
      entries: entries,
      publicFolder: publicFolder,
      isFetching: isFetching,
      collectionName: collection.get('label'),
      viewStyle: viewStyle,
      cursor: cursor,
      handleCursorActions: (0, _partial2.default)(this.handleCursorActions, cursor)
    });
  }

}

_defineProperty(EntriesCollection, "propTypes", {
  collection: _reactImmutableProptypes.default.map.isRequired,
  publicFolder: _propTypes.default.string.isRequired,
  entries: _reactImmutableProptypes.default.list,
  isFetching: _propTypes.default.bool.isRequired,
  viewStyle: _propTypes.default.string,
  cursor: _propTypes.default.object.isRequired,
  loadEntries: _propTypes.default.func.isRequired,
  traverseCollectionCursor: _propTypes.default.func.isRequired
});

function mapStateToProps(state, ownProps) {
  const collection = ownProps.collection,
        viewStyle = ownProps.viewStyle;
  const config = state.config;
  const publicFolder = config.get('public_folder');
  const page = state.entries.getIn(['pages', collection.get('name'), 'page']);
  const entries = (0, _reducers.selectEntries)(state, collection.get('name'));
  const entriesLoaded = !!state.entries.getIn(['pages', collection.get('name')]);
  const isFetching = state.entries.getIn(['pages', collection.get('name'), 'isFetching'], false);
  const rawCursor = (0, _cursors.selectCollectionEntriesCursor)(state.cursors, collection.get('name'));

  const cursor = _netlifyCmsLibUtil.Cursor.create(rawCursor).clearData();

  return {
    publicFolder,
    collection,
    page,
    entries,
    entriesLoaded,
    isFetching,
    viewStyle,
    cursor
  };
}

const mapDispatchToProps = {
  loadEntries: _entries.loadEntries,
  traverseCollectionCursor: _entries.traverseCollectionCursor
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EntriesCollection);

exports.default = _default;