'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

var _dataTable = require('./dataTable');

var _dataTable2 = _interopRequireDefault(_dataTable);

var _MenuItem = require('./MenuItem');

var _MenuItem2 = _interopRequireDefault(_MenuItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'Table',
  getDefaultProps: function getDefaultProps() {
    return {
      fieldsEditable: false
    };
  },
  getInitialState: function getInitialState() {

    this.Data = new _dataTable2.default({ rows: this.props.data, fields: this.props.fields });

    var fields = this.Data.fields;
    var sortBy = this.props.sortBy || fields[0] && fields[0].key || null;

    return {
      sortBy: sortBy,
      sortOrder: 1,
      hiddenFields: {}
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.fields !== nextProps.fields) {
      this.Data.fields = nextProps.fields;
      this.setState({
        sortBy: this.Data.fields[0] && this.Data.fields[0].key
      });
    }
    if (this.props.data !== nextProps.data) {
      this.Data.rows = nextProps.data;
    }
  },

  download: function download() {
    var fileName = arguments.length <= 0 || arguments[0] === undefined ? 'data.csv' : arguments[0];

    var el = document.createElement('a');
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click');
    el.download = fileName;
    el.href = this.Data.csv;
    el.dispatchEvent(event);
  },

  getCarrot: function getCarrot(field) {
    var selected = this.state.sortBy === field.key;
    var icon = selected && this.state.sortOrder === -1 ? 'up' : 'down';
    return _react2.default.createElement('span', { className: 'carrot ' + icon });
  },

  renderEmpty: function renderEmpty() {
    return this.props.empty || _react2.default.createElement(
      'div',
      null,
      'No data'
    );
  },

  render: function render() {
    var _this = this;

    var rows = this.Data.sort(this.state.sortBy, this.state.sortOrder);
    var fields = this.Data.fields;

    if (!fields.length || !rows.length) return this.renderEmpty();

    return _react2.default.createElement(
      'table',
      { className: (0, _classnames2.default)('table', this.props.className) },
      _react2.default.createElement(
        'thead',
        null,
        _react2.default.createElement(
          'tr',
          null,
          fields.map(function (field) {
            return _react2.default.createElement(
              'th',
              { key: field.key,
                hidden: _this.isHidden(field.key),
                className: _this.state.sortBy === field.key && 'selected',
                onClick: function onClick() {
                  return _this.setSort(field);
                } },
              field.label,
              ' ',
              _this.getCarrot(field)
            );
          }),
          _react2.default.createElement(
            'th',
            { className: 'settings', hidden: !this.props.fieldsEditable },
            _react2.default.createElement('button', { className: 'settings-btn', onClick: function onClick() {
                return _this.setState({ showMenu: !_this.state.showMenu });
              } }),
            _react2.default.createElement(
              'ul',
              { className: 'menu', hidden: !this.state.showMenu },
              fields.map(function (field) {
                return _react2.default.createElement(_MenuItem2.default, { key: field.key,
                  value: !_this.isHidden(field.key),
                  label: field.label,
                  onChange: function onChange(e) {
                    return _this.setVisibility(field.key, e.target.checked);
                  } });
              })
            )
          )
        )
      ),
      _react2.default.createElement(
        'tbody',
        null,
        rows.map(function (row, i) {
          return _react2.default.createElement(
            'tr',
            { key: i },
            fields.map(function (field) {
              return _react2.default.createElement(
                'td',
                { key: field.key, hidden: _this.isHidden(field.key) },
                field.format(field.raw(row), row)
              );
            }),
            _react2.default.createElement('td', { hidden: !_this.props.fieldsEditable })
          );
        })
      ),
      _react2.default.createElement(
        'tfoot',
        null,
        _react2.default.createElement(
          'tr',
          null,
          _react2.default.createElement(
            'th',
            null,
            'Total'
          ),
          fields.slice(1).map(function (field) {
            var summary = undefined;
            if (field.summary) {
              summary = field.summary(rows);
            } else if (field.sum) {
              summary = field.sum && rows.map(function (r) {
                return field.raw(r);
              }).reduce(function (a, b) {
                return field.sum(a, b);
              });
            }
            return _react2.default.createElement(
              'th',
              { key: field.key, hidden: _this.isHidden(field.key) },
              summary
            );
          }),
          _react2.default.createElement('th', { hidden: !this.props.fieldsEditable })
        )
      )
    );
  },

  setSort: function setSort(field) {
    if (this.state.sortBy === field.key) {
      this.setState({ sortOrder: -this.state.sortOrder });
    } else {
      this.setState({ sortBy: field.key, sortOrder: 1 });
    }
  },

  isHidden: function isHidden(field) {
    if (!this.state || !this.state.hiddenFields) return false;
    return this.state.hiddenFields[field];
  },

  setVisibility: function setVisibility(field, visible) {
    var change = {};
    change[field] = !visible;
    var hiddenFields = Object.assign({}, this.state.hiddenFields, change);
    this.setState({ hiddenFields: hiddenFields });
  }
});