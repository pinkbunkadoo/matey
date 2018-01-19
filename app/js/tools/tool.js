const EventEmitter = require('events').EventEmitter;

class Tool extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.cursor = null;
  }

  focus() {}
  blur() {}
  handleEvent() {}
}

module.exports = Tool;
