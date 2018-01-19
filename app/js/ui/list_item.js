const Spacer = require('./spacer');
const Container = require('./container');
const Label = require('./label');

function ListItem(params) {
  Container.call(this, params);

  this.id = params.id;
  this.el.classList.add('list-item');
  this.el.data = this.id;

  this.add(new Spacer({ width: 20, height: 20 }));
  this.label = new Label({ title: this.id + ' ' + params.title });
  this.add(this.label);

  this.selected = false;
}

ListItem.prototype = Object.create(Container.prototype);
ListItem.prototype.constructor = ListItem;

ListItem.prototype.select = function() {
  this.selected = true;
  this.el.classList.add('selected');
}

ListItem.prototype.deselect = function() {
  if (this.selected) {
    this.el.classList.remove('selected');
  }
}

module.exports = ListItem;
