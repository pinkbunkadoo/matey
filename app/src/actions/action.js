
class Action {
  constructor(params={}) {
    this.type = params.type;
  }
  undo() {}
}

module.exports = Action;
