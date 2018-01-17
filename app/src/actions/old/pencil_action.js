const Action = require('./action');

function PencilAction() {
  Action.call(this, 'Pencil');
}

PencilAction.prototype = Object.create(Action.prototype);
PencilAction.prototype.constructor = PencilAction;


module.exports = PencilAction;
