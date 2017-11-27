// const Notifier = require('./notifier');

function History() {
  // Notifier.call(this);
  this.states = [];
  this.default = null;
  this.marker = -1;
}

// History.prototype = Object.create(Notifier.prototype);
History.prototype.constructor = History;

History.prototype.notifyChange = function(params) {
  // console.log('frameChange', what);
  // console.log(params);
  // this.message('historyChange', params);
}

History.prototype.add = function(state) {
  if (this.marker < this.states.length - 1) {
    this.states = this.states.slice(0, this.marker + 1);
  }
  this.states.push(state);
  if (this.states.length > 20) this.states.shift();
  this.marker = this.states.length - 1;
  // this.notifyChange({ action: 'insert', index: this.marker, title: state.action.name });
}

History.prototype.isEmpty = function() {
  return this.states.length == 0;
}

History.prototype.get = function() {
  return this.states[this.marker];
}

History.prototype.go = function(index) {
  this.marker = index;
  // this.notifyChange('go');
}

History.prototype.back = function() {
  var action;
  if (this.marker > -1) {
    this.marker--;
  }
  // this.notifyChange('back');
  return this.marker;
}

History.prototype.forward = function() {
  var action;
  if (this.marker < this.states.length - 1) {
    this.marker++;
  }
  // this.notifyChange('forward');
  return this.marker;
}

module.exports = History;

