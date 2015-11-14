const React = require('react');
const clone = require('lodash.clone');
const classNames = require('classnames');

const MenuItem = React.createClass({
  render: function() {
    return (
      <li key={this.props.key}>
        <input type="checkbox"
          checked={this.props.value}
          onChange={this.props.onChange}/>
        {this.props.label}
      </li>
    );
  }
});

function isEmpty(fields, data) {
  if (!fields ||
      !fields.length ||
      !data ||
      !data.length) {
    return true;
  }
}

function findInArray(key, value, arr) {
  let result;
  arr.forEach(item => {
    if (item[key] === value) result = item;
  });
  return result;
}

const Table = React.createClass({
  getDefaultProps: function () {
    fieldsEditable: false
  },
  getInitialState: function () {
    const fields = this.fields();
    const sortBy = this.props.sortBy || fields[0] && fields[0].key || null;

    return {
      sortBy,
      sortOrder: 1,
      hiddenFields: {}
    };
  },
  componentWillReceiveProps: function (nextProps) {
    if (this.props.fields === nextProps.fields) return;
    this.setState({
      sortBy: Object.keys(nextProps.fields)[0]
    });
  },
  fields: function () {
    if (!this.props.fields) return [];
    let fields = this.props.fields.map(field => {
      field = typeof field == 'string' ? {key: field} : clone(field);
      if (!field.label) field.label = field.key;
      if (!field.format) field.format = (row) => row[field.key];
      if (!field.raw) field.raw = (row) => row[field.key];
      return field;
    });
    return fields;
  },
  isHidden: function (field) {
    if (!this.state || !this.state.hiddenFields) return;
    return this.state.hiddenFields[field];
  },
  setVisibility: function (field, visible) {
    const change = {};
    change[field] = !visible;
    const hiddenFields = Object.assign({}, this.state.hiddenFields, change);
    this.setState({hiddenFields});
  },
  sort: function (rows, sortBy, sortOrder) {
    rows = rows.slice();
    const fields = this.fields();

    const field = findInArray('key', sortBy, fields) || fields[0];
    const sort = field.sort || function (x, y) {
      if (typeof x === 'number' && typeof y === 'number') {
        return (x - y) * sortOrder;
      } else {
        return (x > y ? 1 : -1) * sortOrder;
      }
    };
    return rows.sort((x, y) => sort(field.raw(x), field.raw(y)));
  },
  setSort: function (field) {
    if (this.state.sortBy === field.key) {
      this.setState({sortOrder: -this.state.sortOrder});
    } else {
      this.setState({sortBy: field.key, sortOrder: 1});
    }
  },
  getCarrot: function (field) {
    const selected = this.state.sortBy === field.key;
    const icon = (selected && this.state.sortOrder === -1) ? 'up' : 'down';
    return <span className={'carrot ' + icon} />;
  },
  renderEmpty: function () {
    return this.props.empty || <div>No data</div>;
  },
  render: function () {

    const p = this.props;

    if (isEmpty(p.fields, p.data)) return this.renderEmpty(p.fields, p.data);

    const rows = this.sort(p.data, this.state.sortBy, this.state.sortOrder);
    const fields = this.fields();

    return (<div className={classNames('table', this.props.className)}>
      <table>
        <thead>
          <tr>
            {fields.map(field => {
              return (<th key={field.key}
                hidden={this.isHidden(field.key)}
                className={this.state.sortBy === field.key && 'selected'}
                onClick={() => this.setSort(field)}>
                  {field.label} {this.getCarrot(field)}
              </th>);
            })}
            <th className="settings" hidden={!this.props.fieldsEditable}>
              <button className="settings-btn" onClick={() => this.setState({showMenu: !this.state.showMenu})}>
              </button>
              <ul className="menu" hidden={!this.state.showMenu}>
                {fields.map(field => {
                  return (<MenuItem key={field.key}
                      value={!this.isHidden(field.key)}
                      label={field.label}
                      onChange={(e) => this.setVisibility(field.key, e.target.checked)} />
                  );
                })}
              </ul>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            return (<tr key={i}>
              {fields.map(field => <td key={field.key} hidden={this.isHidden(field.key)}>{field.format(row, field.raw(row))}</td>)}
              <td hidden={!this.props.fieldsEditable} />
            </tr>);
          })}
        </tbody>
      </table>
    </div>);
  }
});

module.exports = {
  Table
};
