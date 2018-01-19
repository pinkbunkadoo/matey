const Action = require('./action');

class PaperAction extends Action {
  constructor(params={}) {
    super(params);
    this.state = params.state;
    this.undoState = params.undoState;
    this.frameIndex = params.frameIndex;
  }
}

module.exports = PaperAction;
