const Action = require('./action');

function DeselectAction(options) {
  Action.call(this, 'Deselect');
  this.options = options;
}

DeselectAction.prototype = Object.create(Action.prototype);
DeselectAction.prototype.constructor = DeselectAction;

module.exports = DeselectAction;
