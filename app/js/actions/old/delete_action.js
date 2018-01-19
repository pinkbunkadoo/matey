const Action = require('./action');

function DeleteAction() {
  Action.call(this, 'Delete');
}

DeleteAction.prototype = Object.create(Action.prototype);
DeleteAction.prototype.constructor = DeleteAction;

module.exports = DeleteAction;
