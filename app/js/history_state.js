
function HistoryState(action, snapshot) {
  this.action = action;
  this.snapshot = snapshot;
}

HistoryState.prototype.constructor = HistoryState;

// HistoryState.prototype.set

module.exports = HistoryState;