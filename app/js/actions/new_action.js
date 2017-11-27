const Action = require('./action');

function NewAction() {
  Action.call(this, 'New');
}

NewAction.prototype = Object.create(Action.prototype);
NewAction.prototype.constructor = NewAction;

module.exports = NewAction;
