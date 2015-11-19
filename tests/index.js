import assert from 'assert';
import DataTable from '../src/dataTable';

describe('hello world', function () {
  it('should equal 42', function () {
    assert.ok(42, 42);
  });
});

describe('DataTable', function () {
  let d;

  beforeEach(() => {
    d = new DataTable({
      fields: ['x', 'f'],
      rows: [{f: 2, x: 'a', b: '23123'}, {f: 1, x: 'aasd', b: '23212'}]
    });
  });

  it('should return rows data', () => {
    assert.deepEqual(d.rows, [{f: 2, x: 'a', b: '23123'}, {f: 1, x: 'aasd', b: '23212'}])
  });

  it('should return formatted data', () => {
    assert.deepEqual(d.formatted, [{f: 2, x: 'a'}, {f: 1, x: 'aasd'}])
  });

  it('should sort', () => {
    assert.deepEqual(d.sort('f'), [{f: 1, x: 'aasd', b: '23212'}, {f: 2, x: 'a', b: '23123'}]);
    assert.deepEqual(d.sort('f', -1), [{f: 2, x: 'a', b: '23123'}, {f: 1, x: 'aasd', b: '23212'}]);
  });

});
