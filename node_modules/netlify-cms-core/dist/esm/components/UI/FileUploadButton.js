"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileUploadButton = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const FileUploadButton = (_ref) => {
  let label = _ref.label,
      imagesOnly = _ref.imagesOnly,
      onChange = _ref.onChange,
      disabled = _ref.disabled,
      className = _ref.className;
  return _react.default.createElement("label", {
    className: `nc-fileUploadButton ${className || ''}`
  }, _react.default.createElement("span", null, label), _react.default.createElement("input", {
    type: "file",
    accept: imagesOnly ? 'image/*' : '*/*',
    onChange: onChange,
    disabled: disabled
  }));
};

exports.FileUploadButton = FileUploadButton;
FileUploadButton.propTypes = {
  className: _propTypes.default.string,
  label: _propTypes.default.string.isRequired,
  imagesOnly: _propTypes.default.bool,
  onChange: _propTypes.default.func.isRequired,
  disabled: _propTypes.default.bool
};