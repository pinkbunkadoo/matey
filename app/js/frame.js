
const Const = require('./const');
// const Notifier = require('./notifier');
const History = require('./history');
const Selection = require('./selection');
// const Fragment = require('./fragment');
const Stroke = require('./display/stroke');

function Frame() {
  // Notifier.call(this);
  this.strokes = [];
  this.history = new History();
}

// Frame.prototype = Object.create(Notifier.prototype);
Frame.prototype.constructor = Frame;

Frame.prototype.copy = function() {
  var frame = new Frame();
  for (var i = 0; i < this.strokes.length; i++) {
    var stroke = this.strokes[i];
    // frame.addStroke(stroke.copy());
    frame.strokes.push(stroke.copy());
  }
  return frame;
}

Frame.prototype.focus = function() {

}

Frame.prototype.blur = function() {
}

Frame.prototype.notifyChange = function(what) {
  // console.log('frameChange', what);
  // this.message('frameChange', what);
}

Frame.prototype.addStroke = function(stroke) {
  this.strokes.push(stroke);
  // this.notifyChange('addStroke');
}

Frame.prototype.addStrokes = function(strokes) {
  for (var i = 0; i < strokes.length; i++) {
    this.strokes.push(strokes[i]);
  }
  // this.notifyChange('addStrokes');
}

Frame.prototype.removeStroke = function(stroke) {
  var index = this.strokes.indexOf(stroke);
  if (index != -1) {
    this.strokes.splice(index, 1);
    // this.notifyChange('removeStroke');
  }
}

Frame.prototype.removeStrokes = function(strokes) {
  for (var i = 0; i < strokes.length; i++) {
    this.strokes.splice(this.strokes.indexOf(strokes[i]), 1);
  }
  // this.notifyChange('removeStrokes');
}

Frame.prototype.setStrokes = function(strokes) {
  this.strokes = [];
  for (var i = 0; i < strokes.length; i++) {
    var stroke = strokes[i].copy();
    this.strokes.push(stroke);
  }
  console.log('setStrokes');
  // this.notifyChange('setStrokes');
}

Frame.prototype.sendBack = function(stroke) {
  var index = this.strokes.indexOf(stroke);
  // console.log('before', index);
  if (index !== -1) {
    this.strokes.splice(index, 1);
    this.strokes.splice(index - 1, 0, stroke);
  }
  // this.notifyChange('sendBack');
}

Frame.prototype.bringForward = function(stroke) {
  var index = this.strokes.indexOf(stroke);
  // console.log('before', index);
  if (index !== -1) {
    this.strokes.splice(index, 1);
    this.strokes.splice(index + 1, 0, stroke);
  }
  // this.notifyChange('bringForward');
}

module.exports = Frame;
