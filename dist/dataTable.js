'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SORT_FUNCTIONS = {
  number: function number(x, y, order) {
    return (x - y) * order;
  },
  any: function any(x, y, order) {
    return (x > y ? 1 : -1) * order;
  }
};

var SORT_ORDER = {
  ASC: 1,
  DESC: -1
};

var DataTable = (function () {
  function DataTable(options) {
    _classCallCheck(this, DataTable);

    options = options || {};
    this.fields = options.fields;
    this.rows = options.rows;
  }

  _createClass(DataTable, [{
    key: 'fieldByKey',
    value: function fieldByKey(key) {
      var result = undefined;
      this.fields.forEach(function (field) {
        if (field.key === key) result = field;
      });
      return result;
    }
  }, {
    key: 'sort',
    value: function sort(sortBy) {
      var sortOrder = arguments.length <= 1 || arguments[1] === undefined ? SORT_ORDER.ASC : arguments[1];

      var fields = this.fields;
      var data = this._rawData;
      if (!fields.length || !data.length) return [];
      var sortByField = this.fieldByKey(sortBy) || fields[0];
      var sortByFunction = sortByField.sort || SORT_FUNCTIONS.any;
      return data.slice().sort(function (x, y) {
        return sortByFunction(sortByField.raw(x), sortByField.raw(y), sortOrder);
      });
    }
  }, {
    key: 'formatted',
    get: function get() {
      var fields = this.fields;
      var data = this.rows;
      if (!fields.length || !data.length) return [];
      return data.map(function (row) {
        var result = {};
        fields.filter(function (field) {
          return !field.hidden;
        }).forEach(function (field) {
          result[field.key] = field.format(field.raw(row), row);
        });
        return result;
      });
    }
  }, {
    key: 'fields',
    set: function set(fields) {
      this._rawFields = fields || [];
    },
    get: function get() {
      if (!this._rawFields) return [];
      return this._rawFields.map(function (f) {
        var field = typeof f === 'string' ? { key: f } : (0, _lodash2.default)(f);

        if (!field.label) field.label = field.key;
        if (!field.raw) field.raw = function (row) {
          return row[field.key];
        };
        if (!field.format) field.format = function (raw) {
          return raw;
        };

        return field;
      });
    }
  }, {
    key: 'rows',
    set: function set(data) {
      this._rawData = data || [];
    },
    get: function get() {
      return this._rawData;
    }
  }, {
    key: 'csv',
    get: function get() {
      var fields = this.fields;
      var data = this.rows;
      if (!fields.length || !data.length) return null;
      var headerString = 'data:text/csv;charset=utf-8,';
      var head = fields.map(function (f) {
        return f.label;
      }).join(',') + '\n';
      var body = data.map(function (info) {
        return fields.map(function (field) {
          return field.format(info);
        }).join(',');
      }).join('\n');

      return headerString + encodeURI(head + body);
    }
  }]);

  return DataTable;
})();

exports.default = DataTable;
;