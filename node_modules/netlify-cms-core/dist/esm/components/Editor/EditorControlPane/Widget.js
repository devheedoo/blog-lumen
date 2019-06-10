"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactImmutableProptypes = _interopRequireDefault(require("react-immutable-proptypes"));

var _immutable = require("immutable");

var _validationErrorTypes = _interopRequireDefault(require("../../../constants/validationErrorTypes"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const truthy = () => ({
  error: false
});

const isEmpty = value => value === null || value === undefined || value.hasOwnProperty('length') && value.length === 0 || value.constructor === Object && Object.keys(value).length === 0 || _immutable.List.isList(value) && value.size === 0;

class Widget extends _react.Component {
  constructor() {
    var _this;

    super(...arguments);
    _this = this;

    _defineProperty(this, "processInnerControlRef", ref => {
      if (!ref) return;
      /**
       * If the widget is a container that receives state updates from the store,
       * we'll need to get the ref of the actual control via the `react-redux`
       * `getWrappedInstance` method. Note that connected widgets must pass
       * `withRef: true` to `connect` in the options object.
       */

      this.innerWrappedControl = ref.getWrappedInstance ? ref.getWrappedInstance() : ref;
      this.wrappedControlValid = this.innerWrappedControl.isValid || truthy;
      /**
       * Get the `shouldComponentUpdate` method from the wrapped control, and
       * provide the control instance is the `this` binding.
       */

      const scu = this.innerWrappedControl.shouldComponentUpdate;
      this.wrappedControlShouldComponentUpdate = scu && scu.bind(this.innerWrappedControl);
    });

    _defineProperty(this, "validate", function () {
      let skipWrapped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      const _this$props = _this.props,
            field = _this$props.field,
            value = _this$props.value;
      const errors = [];
      const validations = [_this.validatePresence, _this.validatePattern];
      validations.forEach(func => {
        const response = func(field, value);
        if (response.error) errors.push(response.error);
      });

      if (skipWrapped) {
        if (skipWrapped.error) errors.push(skipWrapped.error);
      } else {
        const wrappedError = _this.validateWrappedControl(field);

        if (wrappedError.error) errors.push(wrappedError.error);
      }

      _this.props.onValidate(errors);
    });

    _defineProperty(this, "validatePresence", (field, value) => {
      const t = this.props.t;
      const isRequired = field.get('required', true);

      if (isRequired && isEmpty(value)) {
        const error = {
          type: _validationErrorTypes.default.PRESENCE,
          message: t('editor.editorControlPane.widget.required', {
            fieldLabel: field.get('label', field.get('name'))
          })
        };
        return {
          error
        };
      }

      return {
        error: false
      };
    });

    _defineProperty(this, "validatePattern", (field, value) => {
      const t = this.props.t;
      const pattern = field.get('pattern', false);

      if (isEmpty(value)) {
        return {
          error: false
        };
      }

      if (pattern && !RegExp(pattern.first()).test(value)) {
        const error = {
          type: _validationErrorTypes.default.PATTERN,
          message: t('editor.editorControlPane.widget.regexPattern', {
            fieldLabel: field.get('label', field.get('name')),
            pattern: pattern.last()
          })
        };
        return {
          error
        };
      }

      return {
        error: false
      };
    });

    _defineProperty(this, "validateWrappedControl", field => {
      const t = this.props.t;
      const response = this.wrappedControlValid();

      if (typeof response === 'boolean') {
        const isValid = response;
        return {
          error: !isValid
        };
      } else if (response.hasOwnProperty('error')) {
        return response;
      } else if (response instanceof Promise) {
        response.then(() => {
          this.validate({
            error: false
          });
        }, err => {
          const error = {
            type: _validationErrorTypes.default.CUSTOM,
            message: `${field.get('label', field.get('name'))} - ${err}.`
          };
          this.validate({
            error
          });
        });
        const error = {
          type: _validationErrorTypes.default.CUSTOM,
          message: t('editor.editorControlPane.widget.processing', {
            fieldLabel: field.get('label', field.get('name'))
          })
        };
        return {
          error
        };
      }

      return {
        error: false
      };
    });

    _defineProperty(this, "getObjectValue", () => this.props.value || (0, _immutable.Map)());

    _defineProperty(this, "onChangeObject", (fieldName, newValue, newMetadata) => {
      const newObjectValue = this.getObjectValue().set(fieldName, newValue);
      return this.props.onChange(newObjectValue, newMetadata && {
        [this.props.field.get('name')]: newMetadata
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    /**
     * Allow widgets to provide their own `shouldComponentUpdate` method.
     */
    if (this.wrappedControlShouldComponentUpdate) {
      return this.wrappedControlShouldComponentUpdate(nextProps);
    }

    return this.props.value !== nextProps.value || this.props.classNameWrapper !== nextProps.classNameWrapper || this.props.hasActiveStyle !== nextProps.hasActiveStyle;
  }

  render() {
    const _this$props2 = this.props,
          controlComponent = _this$props2.controlComponent,
          field = _this$props2.field,
          value = _this$props2.value,
          mediaPaths = _this$props2.mediaPaths,
          metadata = _this$props2.metadata,
          onChange = _this$props2.onChange,
          onValidateObject = _this$props2.onValidateObject,
          onOpenMediaLibrary = _this$props2.onOpenMediaLibrary,
          onRemoveMediaControl = _this$props2.onRemoveMediaControl,
          onClearMediaControl = _this$props2.onClearMediaControl,
          onAddAsset = _this$props2.onAddAsset,
          onRemoveInsertedMedia = _this$props2.onRemoveInsertedMedia,
          getAsset = _this$props2.getAsset,
          classNameWrapper = _this$props2.classNameWrapper,
          classNameWidget = _this$props2.classNameWidget,
          classNameWidgetActive = _this$props2.classNameWidgetActive,
          classNameLabel = _this$props2.classNameLabel,
          classNameLabelActive = _this$props2.classNameLabelActive,
          setActiveStyle = _this$props2.setActiveStyle,
          setInactiveStyle = _this$props2.setInactiveStyle,
          hasActiveStyle = _this$props2.hasActiveStyle,
          editorControl = _this$props2.editorControl,
          uniqueFieldId = _this$props2.uniqueFieldId,
          resolveWidget = _this$props2.resolveWidget,
          getEditorComponents = _this$props2.getEditorComponents,
          query = _this$props2.query,
          queryHits = _this$props2.queryHits,
          clearSearch = _this$props2.clearSearch,
          clearFieldErrors = _this$props2.clearFieldErrors,
          isFetching = _this$props2.isFetching,
          loadEntry = _this$props2.loadEntry,
          fieldsErrors = _this$props2.fieldsErrors,
          controlRef = _this$props2.controlRef,
          t = _this$props2.t;
    return _react.default.createElement(controlComponent, {
      field,
      value,
      mediaPaths,
      metadata,
      onChange,
      onChangeObject: this.onChangeObject,
      onValidateObject,
      onOpenMediaLibrary,
      onClearMediaControl,
      onRemoveMediaControl,
      onAddAsset,
      onRemoveInsertedMedia,
      getAsset,
      forID: uniqueFieldId,
      ref: this.processInnerControlRef,
      classNameWrapper,
      classNameWidget,
      classNameWidgetActive,
      classNameLabel,
      classNameLabelActive,
      setActiveStyle,
      setInactiveStyle,
      hasActiveStyle,
      editorControl,
      resolveWidget,
      getEditorComponents,
      query,
      queryHits,
      clearSearch,
      clearFieldErrors,
      isFetching,
      loadEntry,
      fieldsErrors,
      controlRef,
      t
    });
  }

}

exports.default = Widget;

_defineProperty(Widget, "propTypes", {
  controlComponent: _propTypes.default.func.isRequired,
  field: _reactImmutableProptypes.default.map.isRequired,
  hasActiveStyle: _propTypes.default.bool,
  setActiveStyle: _propTypes.default.func.isRequired,
  setInactiveStyle: _propTypes.default.func.isRequired,
  classNameWrapper: _propTypes.default.string.isRequired,
  classNameWidget: _propTypes.default.string.isRequired,
  classNameWidgetActive: _propTypes.default.string.isRequired,
  classNameLabel: _propTypes.default.string.isRequired,
  classNameLabelActive: _propTypes.default.string.isRequired,
  value: _propTypes.default.oneOfType([_propTypes.default.node, _propTypes.default.object, _propTypes.default.string, _propTypes.default.bool]),
  mediaPaths: _reactImmutableProptypes.default.map.isRequired,
  metadata: _reactImmutableProptypes.default.map,
  fieldsErrors: _reactImmutableProptypes.default.map,
  onChange: _propTypes.default.func.isRequired,
  onValidate: _propTypes.default.func,
  onOpenMediaLibrary: _propTypes.default.func.isRequired,
  onClearMediaControl: _propTypes.default.func.isRequired,
  onRemoveMediaControl: _propTypes.default.func.isRequired,
  onAddAsset: _propTypes.default.func.isRequired,
  onRemoveInsertedMedia: _propTypes.default.func.isRequired,
  getAsset: _propTypes.default.func.isRequired,
  resolveWidget: _propTypes.default.func.isRequired,
  getEditorComponents: _propTypes.default.func.isRequired,
  isFetching: _propTypes.default.bool,
  controlRef: _propTypes.default.func,
  query: _propTypes.default.func.isRequired,
  clearSearch: _propTypes.default.func.isRequired,
  clearFieldErrors: _propTypes.default.func.isRequired,
  queryHits: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
  editorControl: _propTypes.default.func.isRequired,
  uniqueFieldId: _propTypes.default.string.isRequired,
  loadEntry: _propTypes.default.func.isRequired,
  t: _propTypes.default.func.isRequired
});