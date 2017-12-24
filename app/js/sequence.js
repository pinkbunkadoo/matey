const Util = require('./util');
const Point = require('./geom/point');

const Stroke = require('./stroke');
const Frame = require('./frame');
const Selection = require('./selection');

const HistoryState = require('./history_state');
const NewAction = require('./actions/new_action');

class Sequence {
  constructor() {
    this.frames = [];
  }

  add() {
    this.insert(new Frame(), this.frames.length);
  }

  insert(frame, position=0) {
    if (frame) {
      if (position < this.frames.length) {
        this.frames.splice(position, 0, frame);
      } else {
        this.frames.push(frame);
      }
    }
  }

  size() {
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
