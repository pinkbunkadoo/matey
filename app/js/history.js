
function History() {
  this.actions = [];
  this.marker = -1;
}

History.prototype.constructor = History;

History.prototype = {
  add: function(action) {
    // console.log('histoty add');
    this.actions.push(action);
    this.marker = this.actions.length - 1;
  },
  get: function() {
    // console.log('get', this.marker, this.actions);
    return this.actions[this.marker];
  },
  back: function() {
    var action;
    if (this.marker > -1) {
      this.marker--;
      // action = this.actions[this.marker];
    }
    // action.undo();
    // console.log('back marker', this.marker);
    return this.marker;
  },
  forward: function() {
    var action;
    if (this.marker < this.actions.length - 1) {
      this.marker++;
      // console.log(this.marker);
      // action = this.actions[this.marker - 1];
    }
    // action.redo();
    // console.log('forward marker', this.marker);
    return this.marker;
  }
}

module.exports = History;