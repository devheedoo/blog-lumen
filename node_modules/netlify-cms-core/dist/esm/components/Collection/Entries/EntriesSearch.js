"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _reactRedux = require("react-redux");

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

var _reducers = require("../../../reducers");

var _search = require("../../../actions/search");

var _Entries = _interopRequireDefault(require("./Entries"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EntriesSearch extends _react.default.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "getCursor", () => {
      const page = this.props.page;
      return _netlifyCmsLibUtil.Cursor.create({
        actions: isNaN(page) ? [] : ['append_next']
      });
    });

    _defineProperty(this, "handleCursorActions", action => {
      const _this$props = this.props,
            page = _this$props.page,
            searchTerm = _this$props.searchTerm,
            searchEntries = _this$props.searchEntries;

      if (action === 'append_next') {
        const nextPage = page + 1;
        searchEntries(searchTerm, nextPage);
      }
    });
  }

  componentDidMount() {
    const _this$props2 = this.props,
          searchTerm = _this$props2.searchTerm,
          searchEntries = _this$props2.searchEntries;
    searchEntries(searchTerm);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm === this.props.searchTerm) return;
    const searchEntries = prevProps.searchEntries;
    searchEntries(this.props.searchTerm);
  }

  componentWillUnmount() {
    this.props.clearSearch();
  }

  render() {
    const _this$props3 = this.props,
          collections = _this$props3.collections,
          entries = _this$props3.entries,
          publicFolder = _this$props3.publicFolder,
          isFetching = _this$props3.isFetching;
    return _react.default.createElement(_Entries.default, {
      cursor: this.getCursor(),
      handleCursorActions: this.handleCursorActions,
      collections: collections,
      entries: entries,
      publicFolder: publicFolder,
      isFetching: isFetching
    });
  }

}

_defineProperty(EntriesSearch, "propTypes", {
  isFetching: _propTypes.default.bool,
  searchEntries: _propTypes.default.func.isRequired,
  clearSearch: _propTypes.default.func.isRequired,
  searchTerm: _propTypes.default.string.isRequired,
  collections: _reactImmutableProptypes.default.seq,
  entries: _reactImmutableProptypes.default.list,
  page: _propTypes.default.number,
  publicFolder: _propTypes.default.string
});

function mapStateToProps(state, ownProps) {
  const searchTerm = ownProps.searchTerm;
  const collections = ownProps.collections.toIndexedSeq();
  const isFetching = state.search.get('isFetching');
  const page = state.search.get('page');
  const entries = (0, _reducers.selectSearchedEntries)(state);
  const publicFolder = state.config.get('public_folder');
  return {
    isFetching,
    page,
    collections,
    entries,
    publicFolder,
    searchTerm
  };
}

const mapDispatchToProps = {
  searchEntries: _search.searchEntries,
  clearSearch: _search.clearSearch
};

var _default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(EntriesSearch);

exports.default = _default;