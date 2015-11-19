import React from 'react';
import classNames from 'classnames';
import clone from 'lodash.clone';

import DataTable from './dataTable';
import MenuItem from './MenuItem';

export default React.createClass({
  displayName: 'Table',
  getDefaultProps: function() {
    return {
      fieldsEditable: false
    };
  },
  getInitialState: function() {

    this.Data = new DataTable({rows: this.props.data, fields: this.props.fields});

    const fields = this.Data.fields;
    const sortBy = this.props.sortBy || fields[0] && fields[0].key || null;

    return {
      sortBy,
      sortOrder: 1,
      hiddenFields: {}
    };
  },

  componentWillReceiveProps: function(nextProps) {
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

  download: function (fileName='data.csv') {
    const el = document.createElement('a');
    const event = document.createEvent('HTMLEvents');
    event.initEvent('click');
    el.download = fileName;
    el.href = this.Data.csv;
    el.dispatchEvent(event);
  },

  getCarrot: function(field) {
    const selected = this.state.sortBy === field.key;
    const icon = (selected && this.state.sortOrder === -1) ? 'up' : 'down';
    return <span className={'carrot ' + icon} />;
  },

  renderEmpty: function() {
    return this.props.empty || <div>No data</div>;
  },

  render: function() {
    const rows = this.Data.sort(this.state.sortBy, this.state.sortOrder);
    const fields = this.Data.fields;

    if (!fields.length || !rows.length) return this.renderEmpty();

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
              {fields.map(field => <td key={field.key} hidden={this.isHidden(field.key)}>{field.format(field.raw(row), row)}</td>)}
              <td hidden={!this.props.fieldsEditable} />
            </tr>);
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            {fields.slice(1).map(field => {
              const sum = field.sum && rows.map(r => field.raw(r)).reduce((a, b) => field.sum(a, b));
              return (<th key={field.key} hidden={this.isHidden(field.key)}>
                {sum}
              </th>);
            })}
            <th hidden={!this.props.fieldsEditable} />
          </tr>
        </tfoot>
      </table>
    </div>);
  },

  setSort: function(field) {
    if (this.state.sortBy === field.key) {
      this.setState({sortOrder: -this.state.sortOrder});
    } else {
      this.setState({sortBy: field.key, sortOrder: 1});
    }
  },

  isHidden: function(field) {
    if (!this.state || !this.state.hiddenFields) return false;
    return this.state.hiddenFields[field];
  },

  setVisibility: function(field, visible) {
    const change = {};
    change[field] = !visible;
    const hiddenFields = Object.assign({}, this.state.hiddenFields, change);
    this.setState({hiddenFields});
  }
});
