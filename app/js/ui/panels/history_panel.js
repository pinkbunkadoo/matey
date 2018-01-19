const List = require('../list');
const ListItem = require('../list_item');
const Panel = require('../panel');
const Spacer = require('../spacer');
const Container = require('../container');

function HistoryPanel(params) {
  params = params || {};
  params.title = 'History';
  Panel.call(this, params);

  this.listContainer = new Container();
  this.list = new List({ style: { width: '100%', flex: 'auto' }, onSelect: this.onSelect.bind(this) });

  this.listContainer.add(this.list);

  this.setPane(this.listContainer);
  // this.add();
  // this.add(new Spacer({ width: 32, height: 8 }));

  // this.add(this.list);
  // this.add(new Spacer({ width: 32, height: 8 }));

  this.onSelectionChange = params.onSelectionChange;
}

HistoryPanel.prototype = Object.create(Panel.prototype);
HistoryPanel.prototype.constructor = HistoryPanel;

HistoryPanel.prototype.addItem = function(id, title) {
  var listItem = new ListItem({ id: id, title: title });
  this.list.addItem(listItem);
  listItem.el.data = id;
}

HistoryPanel.prototype.insertItem = function(index, id, title) {
  // console.log('HistoryPanel.prototype.insertItem', index, id, title);
  var listItem = new ListItem({ id: id, title: title });
  // this.list.addItem(listItem);
  this.list.insertItem(index, listItem);
  listItem.el.data = id;
  // console.log(this.list);
}

HistoryPanel.prototype.removeItem = function(index) {
  this.list.removeItem(index);
}

HistoryPanel.prototype.clear = function() {
  this.list.removeAll();
}

HistoryPanel.prototype.selectItem = function(index) {
  // console.log('HistoryPanel.prototype.selectItem', index);
  // console.log('selectItem', index);
  this.list.select(index);
}

HistoryPanel.prototype.onSelect = function(params) {
  // console.log(params.item);

  if (this.onSelectionChange) {
    // this.onSelectionChange(params);
  }
  // console.log(params);
  this.emit("select", { id: params.item.id });

  // console.log('onSelect', App.sequence.history.marker);
}

HistoryPanel.prototype.render = function(params) {
  if (params.cmd === 'add') {
    this.addItem(params.id, params.title);
  }
  else if (params.cmd === 'select') {
    this.selectItem(params.index);
  }
  else if (params.cmd === 'populate') {
    this.clear();
    for (var i = 0; i < params.items.length; i++) {
      var item = params.items[i]
      this.addItem(item.id, item.title);
    }
    // this.selectItem(params.index);
  }
}

module.exports = HistoryPanel;
