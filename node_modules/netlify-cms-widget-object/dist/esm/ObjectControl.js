"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _core = require("@emotion/core");

var _immutable = require("immutable");

var _netlifyCmsUiDefault = require("netlify-cms-ui-default");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const styleStrings = {
  nestedObjectControl: `
    padding: 6px 14px 14px;
    border-top: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
  objectWidgetTopBarContainer: `
    padding: ${_netlifyCmsUiDefault.lengths.objectWidgetTopBarContainerPadding}
  `
};

class ObjectControl extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "componentValidate", {});

    _defineProperty(this, "validate", () => {
      const field = this.props.field;
      let fields = field.get('field') || field.get('fields');
      fields = _immutable.List.isList(fields) ? fields : (0, _immutable.List)([fields]);
      fields.forEach(field => {
        if (field.get('widget') === 'hidden') return;
        this.componentValidate[field.get('name')]();
      });
    });

    _defineProperty(this, "handleCollapseToggle", () => {
      this.setState({
        collapsed: !this.state.collapsed
      });
    });

    _defineProperty(this, "renderFields", (multiFields, singleField) => {
      if (multiFields) {
        return multiFields.map((f, idx) => this.controlFor(f, idx));
      }

      return this.controlFor(singleField);
    });

    this.state = {
      collapsed: false
    };
  }
  /*
   * Always update so that each nested widget has the option to update. This is
   * required because ControlHOC provides a default `shouldComponentUpdate`
   * which only updates if the value changes, but every widget must be allowed
   * to override this.
   */


  shouldComponentUpdate() {
    return true;
  }

  controlFor(field, key) {
    const _this$props = this.props,
          value = _this$props.value,
          onChangeObject = _this$props.onChangeObject,
          onValidateObject = _this$props.onValidateObject,
          clearFieldErrors = _this$props.clearFieldErrors,
          metadata = _this$props.metadata,
          fieldsErrors = _this$props.fieldsErrors,
          EditorControl = _this$props.editorControl,
          controlRef = _this$props.controlRef;

    if (field.get('widget') === 'hidden') {
      return null;
    }

    const fieldName = field.get('name');
    const fieldValue = value && _immutable.Map.isMap(value) ? value.get(fieldName) : value;
    return _react.default.createElement(EditorControl, {
      key: key,
      field: field,
      value: fieldValue,
      onChange: onChangeObject,
      clearFieldErrors: clearFieldErrors,
      fieldsMetaData: metadata,
      fieldsErrors: fieldsErrors,
      onValidate: onValidateObject,
      processControlRef: controlRef && controlRef.bind(this),
      controlRef: controlRef
    });
  }

  render() {
    const _this$props2 = this.props,
          field = _this$props2.field,
          forID = _this$props2.forID,
          classNameWrapper = _this$props2.classNameWrapper,
          forList = _this$props2.forList;
    const collapsed = this.state.collapsed;
    const multiFields = field.get('fields');
    const singleField = field.get('field');

    if (multiFields || singleField) {
      return _react.default.createElement(_core.ClassNames, null, (_ref) => {
        let css = _ref.css,
            cx = _ref.cx;
        return _react.default.createElement("div", {
          id: forID,
          className: cx(classNameWrapper, css`
                  ${styleStrings.objectWidgetTopBarContainer}
                `, {
            [css`
                    ${styleStrings.nestedObjectControl}
                  `]: forList
          })
        }, forList ? null : _react.default.createElement(_netlifyCmsUiDefault.ObjectWidgetTopBar, {
          collapsed: collapsed,
          onCollapseToggle: this.handleCollapseToggle
        }), collapsed ? null : this.renderFields(multiFields, singleField));
      });
    }

    return _react.default.createElement("h3", null, "No field(s) defined for this widget");
  }

}

exports.default = ObjectControl;

_defineProperty(ObjectControl, "propTypes", {
  onChangeObject: _propTypes.default.func.isRequired,
  onValidateObject: _propTypes.default.func.isRequired,
  value: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.object, _propTypes.default.bool]),
  field: _propTypes.default.object,
  forID: _propTypes.default.string,
  classNameWrapper: _propTypes.default.string.isRequired,
  forList: _propTypes.default.bool,
  controlRef: _propTypes.default.func,
  editorControl: _propTypes.default.func.isRequired,
  resolveWidget: _propTypes.default.func.isRequired,
  clearFieldErrors: _propTypes.default.func.isRequired,
  fieldsErrors: _reactImmutableProptypes.default.map.isRequired
});

_defineProperty(ObjectControl, "defaultProps", {
  value: (0, _immutable.Map)()
});