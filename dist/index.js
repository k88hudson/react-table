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

function isEmpty(fields, data) {
  if (!fields || !fields.length || !data || !data.length) {
    return true;
  }
}

function findInArray(key, value, arr) {
  var result = undefined;
  arr.forEach(function (item) {
    if (item[key] === value) result = item;
  });
  return result;
}

var Table = React.createClass({
  getDefaultProps: function getDefaultProps() {
    fieldsEditable: false;
  },
  getInitialState: function getInitialState() {
    var fields = this.fields();
    var sortBy = this.props.sortBy || fields[0] && fields[0].key || null;

    return {
      sortBy: sortBy,
      sortOrder: 1,
      hiddenFields: {}
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.fields === nextProps.fields) return;
    this.setState({
      sortBy: Object.keys(nextProps.fields)[0]
    });
  },
  fields: function fields() {
    if (!this.props.fields) return [];
    var fields = this.props.fields.map(function (field) {
      field = typeof field == 'string' ? { key: field } : clone(field);
      if (!field.label) field.label = field.key;
      if (!field.format) field.format = function (row) {
        return row[field.key];
      };
      if (!field.raw) field.raw = function (row) {
        return row[field.key];
      };
      return field;
    });
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
    var fields = this.fields();

    var field = findInArray('key', sortBy, fields) || fields[0];
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
  renderEmpty: function renderEmpty() {
    return this.props.empty || React.createElement(
      'div',
      null,
      'No data'
    );
  },
  render: function render() {
    var _this = this;

    var p = this.props;

    if (isEmpty(p.fields, p.data)) return this.renderEmpty(p.fields, p.data);

    var rows = this.sort(p.data, this.state.sortBy, this.state.sortOrder);
    var fields = this.fields();

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
