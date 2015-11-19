'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'MenuItem',
  render: function render() {
    return _react2.default.createElement(
      'li',
      { key: this.props.key },
      _react2.default.createElement('input', { type: 'checkbox',
        checked: this.props.value,
        onChange: this.props.onChange }),
      this.props.label
    );
  }
});