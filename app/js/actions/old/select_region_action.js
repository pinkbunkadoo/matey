const Action = require('./action.js');

function SelectRegionAction(region, snapshot) {
  Action.call(this, 'select region');
  this.region = region;
  this.snapshot = snapshot;
}

SelectRegionAction.prototype = Object.create(Action.prototype);
SelectRegionAction.prototype.constructor = SelectRegionAction;

SelectRegionAction.prototype = {
  do: function() {
    // App.frame.select(options.region);
  }
};

module.exports = SelectRegionAction;
