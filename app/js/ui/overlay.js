const Container = require('./container');

class Overlay extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('overlay');
  }
}

module.exports = Overlay;
