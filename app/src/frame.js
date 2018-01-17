const FrameState = require('./frame_state');
const History = require('./history');
const Selection = require('./selection');
const Stroke = require('./stroke');

class Frame {
  constructor() {
    this.strokes = [];
    this.history = new History();
  }

  copy() {
    var frame = new Frame();
    for (var i = 0; i < this.strokes.length; i++) {
      frame.strokes.push(this.strokes[i].copy());
    }
    return frame;
  }

  getState() {
    return new FrameState({ strokes: this.strokes });
  }

  addStroke(stroke) {
    this.strokes.push(stroke.copy());
  }

  addStrokes(strokes) {
    for (var i = 0; i < strokes.length; i++) {
      this.strokes.push(strokes[i].copy());
    }
  }

  removeStroke(stroke) {
    var index = this.strokes.indexOf(stroke);
    if (index != -1) {
      this.strokes.splice(index, 1);
    }
  }

  removeStrokes(strokes) {
    for (var i = 0; i < strokes.length; i++) {
      this.strokes.splice(this.strokes.indexOf(strokes[i]), 1);
    }
  }

  setStrokes(strokes) {
    this.strokes = [];
    for (var i = 0; i < strokes.length; i++) {
      this.strokes.push(strokes[i].copy());
    }
  }

}

module.exports = Frame;
