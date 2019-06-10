"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _styledBase = _interopRequireDefault(require("@emotion/styled-base"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _reactWaypoint = _interopRequireDefault(require("react-waypoint"));

var _immutable = require("immutable");

var _netlifyCmsLibUtil = require("netlify-cms-lib-util");

var _collections = require("../../../reducers/collections");

var _EntryCard = _interopRequireDefault(require("./EntryCard"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const CardsGrid = (0, _styledBase.default)("ul", {
  target: "e1hbvtjf0",
  label: "CardsGrid"
})(process.env.NODE_ENV === "production" ? {
  name: "1gscq6o",
  styles: "display:flex;flex-flow:row wrap;list-style-type:none;margin-left:-12px;"
} : {
  name: "1gscq6o",
  styles: "display:flex;flex-flow:row wrap;list-style-type:none;margin-left:-12px;",
  map: "/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NvbGxlY3Rpb24vRW50cmllcy9FbnRyeUxpc3RpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBVTJCIiwiZmlsZSI6Ii4uLy4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL0NvbGxlY3Rpb24vRW50cmllcy9FbnRyeUxpc3RpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBJbW11dGFibGVQcm9wVHlwZXMgZnJvbSAncmVhY3QtaW1tdXRhYmxlLXByb3B0eXBlcyc7XG5pbXBvcnQgc3R5bGVkIGZyb20gJ0BlbW90aW9uL3N0eWxlZCc7XG5pbXBvcnQgV2F5cG9pbnQgZnJvbSAncmVhY3Qtd2F5cG9pbnQnO1xuaW1wb3J0IHsgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IEN1cnNvciB9IGZyb20gJ25ldGxpZnktY21zLWxpYi11dGlsJztcbmltcG9ydCB7IHNlbGVjdEZpZWxkcywgc2VsZWN0SW5mZXJlZEZpZWxkIH0gZnJvbSAnUmVkdWNlcnMvY29sbGVjdGlvbnMnO1xuaW1wb3J0IEVudHJ5Q2FyZCBmcm9tICcuL0VudHJ5Q2FyZCc7XG5cbmNvbnN0IENhcmRzR3JpZCA9IHN0eWxlZC51bGBcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1mbG93OiByb3cgd3JhcDtcbiAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xuICBtYXJnaW4tbGVmdDogLTEycHg7XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbnRyeUxpc3RpbmcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHB1YmxpY0ZvbGRlcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGNvbGxlY3Rpb25zOiBJbW11dGFibGVQcm9wVHlwZXMuaXRlcmFibGUuaXNSZXF1aXJlZCxcbiAgICBlbnRyaWVzOiBJbW11dGFibGVQcm9wVHlwZXMubGlzdCxcbiAgICB2aWV3U3R5bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgY3Vyc29yOiBQcm9wVHlwZXMuYW55LmlzUmVxdWlyZWQsXG4gICAgaGFuZGxlQ3Vyc29yQWN0aW9uczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfTtcblxuICBoYW5kbGVMb2FkTW9yZSA9ICgpID0+IHtcbiAgICBjb25zdCB7IGN1cnNvciwgaGFuZGxlQ3Vyc29yQWN0aW9ucyB9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoQ3Vyc29yLmNyZWF0ZShjdXJzb3IpLmFjdGlvbnMuaGFzKCdhcHBlbmRfbmV4dCcpKSB7XG4gICAgICBoYW5kbGVDdXJzb3JBY3Rpb25zKCdhcHBlbmRfbmV4dCcpO1xuICAgIH1cbiAgfTtcblxuICBpbmZlckZpZWxkcyA9IGNvbGxlY3Rpb24gPT4ge1xuICAgIGNvbnN0IHRpdGxlRmllbGQgPSBzZWxlY3RJbmZlcmVkRmllbGQoY29sbGVjdGlvbiwgJ3RpdGxlJyk7XG4gICAgY29uc3QgZGVzY3JpcHRpb25GaWVsZCA9IHNlbGVjdEluZmVyZWRGaWVsZChjb2xsZWN0aW9uLCAnZGVzY3JpcHRpb24nKTtcbiAgICBjb25zdCBpbWFnZUZpZWxkID0gc2VsZWN0SW5mZXJlZEZpZWxkKGNvbGxlY3Rpb24sICdpbWFnZScpO1xuICAgIGNvbnN0IGZpZWxkcyA9IHNlbGVjdEZpZWxkcyhjb2xsZWN0aW9uKTtcbiAgICBjb25zdCBpbmZlcmVkRmllbGRzID0gW3RpdGxlRmllbGQsIGRlc2NyaXB0aW9uRmllbGQsIGltYWdlRmllbGRdO1xuICAgIGNvbnN0IHJlbWFpbmluZ0ZpZWxkcyA9XG4gICAgICBmaWVsZHMgJiYgZmllbGRzLmZpbHRlcihmID0+IGluZmVyZWRGaWVsZHMuaW5kZXhPZihmLmdldCgnbmFtZScpKSA9PT0gLTEpO1xuICAgIHJldHVybiB7IHRpdGxlRmllbGQsIGRlc2NyaXB0aW9uRmllbGQsIGltYWdlRmllbGQsIHJlbWFpbmluZ0ZpZWxkcyB9O1xuICB9O1xuXG4gIHJlbmRlckNhcmRzRm9yU2luZ2xlQ29sbGVjdGlvbiA9ICgpID0+IHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zLCBlbnRyaWVzLCBwdWJsaWNGb2xkZXIsIHZpZXdTdHlsZSB9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBpbmZlcmVkRmllbGRzID0gdGhpcy5pbmZlckZpZWxkcyhjb2xsZWN0aW9ucyk7XG4gICAgY29uc3QgZW50cnlDYXJkUHJvcHMgPSB7IGNvbGxlY3Rpb246IGNvbGxlY3Rpb25zLCBpbmZlcmVkRmllbGRzLCBwdWJsaWNGb2xkZXIsIHZpZXdTdHlsZSB9O1xuICAgIHJldHVybiBlbnRyaWVzLm1hcCgoZW50cnksIGlkeCkgPT4gPEVudHJ5Q2FyZCB7Li4uZW50cnlDYXJkUHJvcHN9IGVudHJ5PXtlbnRyeX0ga2V5PXtpZHh9IC8+KTtcbiAgfTtcblxuICByZW5kZXJDYXJkc0Zvck11bHRpcGxlQ29sbGVjdGlvbnMgPSAoKSA9PiB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9ucywgZW50cmllcywgcHVibGljRm9sZGVyIH0gPSB0aGlzLnByb3BzO1xuICAgIHJldHVybiBlbnRyaWVzLm1hcCgoZW50cnksIGlkeCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbk5hbWUgPSBlbnRyeS5nZXQoJ2NvbGxlY3Rpb24nKTtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb24gPSBjb2xsZWN0aW9ucy5maW5kKGNvbGwgPT4gY29sbC5nZXQoJ25hbWUnKSA9PT0gY29sbGVjdGlvbk5hbWUpO1xuICAgICAgY29uc3QgY29sbGVjdGlvbkxhYmVsID0gY29sbGVjdGlvbi5nZXQoJ2xhYmVsJyk7XG4gICAgICBjb25zdCBpbmZlcmVkRmllbGRzID0gdGhpcy5pbmZlckZpZWxkcyhjb2xsZWN0aW9uKTtcbiAgICAgIGNvbnN0IGVudHJ5Q2FyZFByb3BzID0geyBjb2xsZWN0aW9uLCBlbnRyeSwgaW5mZXJlZEZpZWxkcywgcHVibGljRm9sZGVyLCBjb2xsZWN0aW9uTGFiZWwgfTtcbiAgICAgIHJldHVybiA8RW50cnlDYXJkIHsuLi5lbnRyeUNhcmRQcm9wc30ga2V5PXtpZHh9IC8+O1xuICAgIH0pO1xuICB9O1xuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7IGNvbGxlY3Rpb25zIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxDYXJkc0dyaWQ+XG4gICAgICAgICAge01hcC5pc01hcChjb2xsZWN0aW9ucylcbiAgICAgICAgICAgID8gdGhpcy5yZW5kZXJDYXJkc0ZvclNpbmdsZUNvbGxlY3Rpb24oKVxuICAgICAgICAgICAgOiB0aGlzLnJlbmRlckNhcmRzRm9yTXVsdGlwbGVDb2xsZWN0aW9ucygpfVxuICAgICAgICAgIDxXYXlwb2ludCBvbkVudGVyPXt0aGlzLmhhbmRsZUxvYWRNb3JlfSAvPlxuICAgICAgICA8L0NhcmRzR3JpZD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ== */"
});

class EntryListing extends _react.default.Component {
  constructor() {
    super(...arguments);

    _defineProperty(this, "handleLoadMore", () => {
      const _this$props = this.props,
            cursor = _this$props.cursor,
            handleCursorActions = _this$props.handleCursorActions;

      if (_netlifyCmsLibUtil.Cursor.create(cursor).actions.has('append_next')) {
        handleCursorActions('append_next');
      }
    });

    _defineProperty(this, "inferFields", collection => {
      const titleField = (0, _collections.selectInferedField)(collection, 'title');
      const descriptionField = (0, _collections.selectInferedField)(collection, 'description');
      const imageField = (0, _collections.selectInferedField)(collection, 'image');
      const fields = (0, _collections.selectFields)(collection);
      const inferedFields = [titleField, descriptionField, imageField];
      const remainingFields = fields && fields.filter(f => inferedFields.indexOf(f.get('name')) === -1);
      return {
        titleField,
        descriptionField,
        imageField,
        remainingFields
      };
    });

    _defineProperty(this, "renderCardsForSingleCollection", () => {
      const _this$props2 = this.props,
            collections = _this$props2.collections,
            entries = _this$props2.entries,
            publicFolder = _this$props2.publicFolder,
            viewStyle = _this$props2.viewStyle;
      const inferedFields = this.inferFields(collections);
      const entryCardProps = {
        collection: collections,
        inferedFields,
        publicFolder,
        viewStyle
      };
      return entries.map((entry, idx) => _react.default.createElement(_EntryCard.default, _extends({}, entryCardProps, {
        entry: entry,
        key: idx
      })));
    });

    _defineProperty(this, "renderCardsForMultipleCollections", () => {
      const _this$props3 = this.props,
            collections = _this$props3.collections,
            entries = _this$props3.entries,
            publicFolder = _this$props3.publicFolder;
      return entries.map((entry, idx) => {
        const collectionName = entry.get('collection');
        const collection = collections.find(coll => coll.get('name') === collectionName);
        const collectionLabel = collection.get('label');
        const inferedFields = this.inferFields(collection);
        const entryCardProps = {
          collection,
          entry,
          inferedFields,
          publicFolder,
          collectionLabel
        };
        return _react.default.createElement(_EntryCard.default, _extends({}, entryCardProps, {
          key: idx
        }));
      });
    });
  }

  render() {
    const collections = this.props.collections;
    return _react.default.createElement("div", null, _react.default.createElement(CardsGrid, null, _immutable.Map.isMap(collections) ? this.renderCardsForSingleCollection() : this.renderCardsForMultipleCollections(), _react.default.createElement(_reactWaypoint.default, {
      onEnter: this.handleLoadMore
    })));
  }

}

exports.default = EntryListing;

_defineProperty(EntryListing, "propTypes", {
  publicFolder: _propTypes.default.string.isRequired,
  collections: _reactImmutableProptypes.default.iterable.isRequired,
  entries: _reactImmutableProptypes.default.list,
  viewStyle: _propTypes.default.string,
  cursor: _propTypes.default.any.isRequired,
  handleCursorActions: _propTypes.default.func.isRequired
});