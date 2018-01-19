const Action = require('./action');

function SetPropertyAction(params) {
  Action.call(this, 'Set Property');
  // this.options = options;
}

SetPropertyAction.prototype = Object.create(Action.prototype);
SetPropertyAction.prototype.constructor = SetPropertyAction;

module.exports = SetPropertyAction;
