const Util = require('./util');
const Point = require('./geom/point');
const Stroke = require('./stroke');
const Frame = require('./frame');
const Selection = require('./selection');

class Sequence {
  constructor(params={}) {
    this.fps = params.fps || 6;
    this.frames = [];
  }

  add(frame) {
    frame = frame || new Frame();
    this.frames.push(frame);
    return this.frames[this.frames.length - 1];
  }

  insert(frame, position=0) {
    if (frame) {
      if (position < this.frames.length) {
        this.frames.splice(position, 0, frame);
      } else {
        this.frames.push(frame);
      }
    }
    return this.frames[this.frames.length - 1];
  }

  get size() {
    return this.frames.length;
  }

  remove(match) {
    if (match instanceof Frame) {
      var index = this.frames.indexOf(match);
      if (index !== -1) {
        this.frames.splice(index, 1);
      }
    } else if (Number.isInteger(match)) {
      this.frames.splice(match, 1);
    }
  }

  getFrame(index) {
    return this.frames[index];
  }

}

module.exports = Sequence;
