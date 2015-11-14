const React = require('react');
const ReactDOM = require('react-dom');

const {Table} = require('../index');

const fields = [
  {key: 'name', label: 'Name'},
  {key: 'age', label: 'Age'},
  {key: 'fav_color', label: 'Favourite Colour'}
];

const data = [
  {name: 'François Duras', age: 43, fav_color: 'bleue'},
  {name: 'Isabelle Laval', age: 29, fav_color: 'rouge'},
  {name: 'Catherine Dupont', age: 27, fav_color: 'rose'}
]

const Demo = React.createClass({
  render: function () {
    return (<div>
      <Table fields={fields} data={data} fieldsEditable />
      <Table fields={['name', 'age', 'fav_color']} data={data} fieldsEditable />
      <Table fields={null} data={null} />
    </div>);
  }
});

ReactDOM.render(<Demo />, document.getElementById('app'));
