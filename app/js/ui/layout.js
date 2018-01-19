const Column = require('./layout/column.js');
const Row = require('./layout/row.js');

function Layout() {

}

Layout.prototype.constructor = Layout;

Layout.prototype.row = function(params) {
  var item = new Row(params);
  return item;
}

Layout.prototype.column = function(params) {
  var item = new Column(params);
  return item;
}

module.exports = Layout;
