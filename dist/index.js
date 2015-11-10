'use strict';

var React = require('react');
var clone = require('lodash.clone');
var classNames = require('classnames');

var MenuItem = React.createClass({
  render: function render() {
    return React.createElement(
      'li',
      { key: this.props.key },
      React.createElement('input', { type: 'checkbox',
        checked: this.props.value,
        onChange: this.props.onChange }),
      this.props.label
    );
  }
});

var Table = React.createClass({
  getDefaultProps: function getDefaultProps() {
    fieldsEditable: false;
  },
  getInitialState: function getInitialState() {
    return {
      sortBy: this.props.sortBy || this.fields()._asArray[0].key || '',
      sortOrder: 1,
      hiddenFields: {}
    };
  },
  fields: function fields() {
    var fields = undefined;

    if (this.props.fields instanceof Array) {
      fields = {};
      this.props.fields.forEach(function (field) {
        return fields[field] = {};
      });
    } else {
      fields = clone(this.props.fields);
    }

    var arr = [];

    Object.keys(fields).map(function (key) {
      var field = fields[key];
      field.key = key;
      if (!field.label) field.label = field.key;
      if (!field.format) field.format = function (row) {
        return row[field.key];
      };
      if (!field.raw) field.raw = function (row) {
        return row[field.key];
      };
      arr.push(field);
    });

    fields._asArray = arr;

    return fields;
  },
  isHidden: function isHidden(field) {
    if (!this.state || !this.state.hiddenFields) return;
    return this.state.hiddenFields[field];
  },
  setVisibility: function setVisibility(field, visible) {
    var change = {};
    change[field] = !visible;
    var hiddenFields = Object.assign({}, this.state.hiddenFields, change);
    this.setState({ hiddenFields: hiddenFields });
  },
  sort: function sort(rows, sortBy, sortOrder) {
    rows = rows.slice();

    var field = this.fields()[sortBy];
    var sort = field.sort || function (x, y) {
      if (typeof x === 'number' && typeof y === 'number') {
        return (x - y) * sortOrder;
      } else {
        return (x > y ? 1 : -1) * sortOrder;
      }
    };
    return rows.sort(function (x, y) {
      return sort(field.raw(x), field.raw(y));
    });
  },
  setSort: function setSort(field) {
    if (this.state.sortBy === field.key) {
      this.setState({ sortOrder: -this.state.sortOrder });
    } else {
      this.setState({ sortBy: field.key, sortOrder: 1 });
    }
  },
  getCarrot: function getCarrot(field) {
    var selected = this.state.sortBy === field.key;
    var icon = selected && this.state.sortOrder === -1 ? 'up' : 'down';
    return React.createElement('span', { className: 'carrot ' + icon });
  },
  render: function render() {
    var _this = this;

    var rows = this.sort(this.props.data, this.state.sortBy, this.state.sortOrder);
    var fields = this.fields()._asArray;

    return React.createElement(
      'div',
      { className: classNames('table', this.props.className) },
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            null,
            fields.map(function (field) {
              return React.createElement(
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
            React.createElement(
              'th',
              { className: 'settings', hidden: !this.props.fieldsEditable },
              React.createElement('button', { className: 'settings-btn', onClick: function onClick() {
                  return _this.setState({ showMenu: !_this.state.showMenu });
                } }),
              React.createElement(
                'ul',
                { className: 'menu', hidden: !this.state.showMenu },
                fields.map(function (field) {
                  return React.createElement(MenuItem, { key: field.key,
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
        React.createElement(
          'tbody',
          null,
          rows.map(function (row, i) {
            return React.createElement(
              'tr',
              { key: i },
              fields.map(function (field) {
                return React.createElement(
                  'td',
                  { key: field.key, hidden: _this.isHidden(field.key) },
                  field.format(row, field.raw(row))
                );
              }),
              React.createElement('td', { hidden: !_this.props.fieldsEditable })
            );
          })
        )
      )
    );
  }
});

module.exports = {
  Table: Table
};
