const Action = require('./action.js');

function SelectAction(options) {
  Action.call(this, 'select');
  this.options = options;
}

SelectAction.prototype = Object.create(Action.prototype);
SelectAction.prototype.constructor = SelectAction;

SelectAction.prototype = {
  do: function() {
    // App.frame.select(options.region);
  }
};

module.exports = SelectAction;
