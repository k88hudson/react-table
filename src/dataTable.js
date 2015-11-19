import clone from 'lodash.clone';

const SORT_FUNCTIONS = {
  number: (x, y, order) => (x - y) * order,
  any: (x, y, order) => (x > y ? 1 : -1) * order
};

const SORT_ORDER = {
  ASC: 1,
  DESC: -1
};

export default class DataTable {
  constructor(options) {
    options = options || {};
    this.fields = options.fields;
    this.rows = options.rows;
  }

  fieldByKey(key) {
    let result;
    this.fields.forEach(field => {
      if (field.key === key) result = field;
    });
    return result;
  }

  get formatted() {
    const fields = this.fields;
    const data = this.rows;
    if (!fields.length || !data.length) return [];
    return data.map(row => {
      const result = {};
      fields.filter(field => !field.hidden).forEach(field => {
        result[field.key] = field.format(field.raw(row), row);
      });
      return result;
    });
  }

  set fields(fields) {
    this._rawFields = fields || [];
  }

  get fields() {
    if (!this._rawFields) return [];
    return this._rawFields.map(f => {
      const field = typeof f === 'string' ? {key: f} : clone(f);

      if (!field.label) field.label = field.key;
      if (!field.raw) field.raw = (row) => row[field.key];
      if (!field.format) field.format = (raw) => raw;

      return field;
    });
  }

  set rows(data) {
    this._rawData = data || [];
  }

  get rows() {
    return this._rawData;
  }

  get csv() {
    const fields = this.fields;
    const data = this.rows;
    if (!fields.length || !data.length) return null;
    const headerString = 'data:text/csv;charset=utf-8,';
    const head = fields.map(f => f.label).join(',') + '\n';
    const body = data.map(info => {
      return fields.map(field => field.format(info)).join(',');
    }).join('\n');

    return headerString + encodeURI(head + body);
  }

  sort(sortBy, sortOrder=SORT_ORDER.ASC) {
    const fields = this.fields;
    const data = this._rawData;
    if (!fields.length || !data.length) return [];
    const sortByField = this.fieldByKey(sortBy) || fields[0];
    const sortByFunction = sortByField.sort || SORT_FUNCTIONS.any;
    return data
      .slice()
      .sort((x, y) => sortByFunction(sortByField.raw(x), sortByField.raw(y), sortOrder));
  }
};
