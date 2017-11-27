const Action = require('./action');

function LineAction() {
  Action.call(this, 'Line');
}

LineAction.prototype = Object.create(Action.prototype);
LineAction.prototype.constructor = LineAction;


module.exports = LineAction;
