const Util = require('./util');
const Point = require('./geom/point');

const Stroke = require('./display/stroke');
const Frame = require('./frame');
const Selection = require('./selection');

const HistoryState = require('./history_state');
const NewAction = require('./actions/new_action');

function Sequence() {
  this.frames = [];
  this.selection = new Selection();
  this.position = 0;
  this.frame = null;
}

Sequence.prototype.constructor = Sequence;

Sequence.prototype = {
  add: function() {
    this.insert(new Frame(), this.frames.length);
  },

  insert: function(frame, position) {
    position = position ||  0;
    params = {};

    if (position < this.frames.length) {
      this.frames.splice(position, 0, frame);
    } else {
      this.frames.push(frame);
    }

    // frame.subscribe('frameChange', app, app.onFrameChange);
    // frame.history.subscribe('historyChange', app, app.onHistoryChange);


  },

  remove: function(frame) {
    frame = frame || this.frame;
    var index = this.frames.indexOf(frame);
    if (index !== -1) {
      if (this.frames.length > 1) {
        this.frames.splice(index, 1);
      }
    }
  },

  addAction: function(action, frame) {
    frame = frame || this.frame;
    var history = frame.history;
    history.add(new HistoryState(action, frame.copy()));
  },

  updateState: function(state) {
    state = state || this.frame.history.get();
    state.snapshot = this.frame.copy();
  },

  setState: function(state) {
    this.selection.clear();
    this.frame.setStrokes(state.snapshot.strokes);
    for (var i = 0; i < this.frame.strokes.length; i++) {
      var stroke = this.frame.strokes[i];
      if (stroke.selected) {
        this.selection.add(stroke);
      }
    }
  },

  undo: function() {
    if (this.frame.history.marker) {
      this.frame.history.back();
      var state = this.frame.history.get();
      this.setState(state);
    }
  },

  redo: function() {
    if (this.frame.history.marker < this.frame.history.states.length - 1) {
      this.frame.history.forward();
      var state = this.frame.history.get();
      this.setState(state);
    }
  },

  setHistoryIndex: function(index) {
    this.frame.history.go(index);
    var state = this.frame.history.get();
    this.setState(state);
  },

  fuse: function(element, selected) {
    var first = element.points[0];
    var last = element.points[element.points.length - 1];
    var strokes = this.frame.strokes;
    var removeList = [];

    for (var j = 0; j < strokes.length; j++) {
      var stroke = strokes[j];
      var p1 = stroke.points[0];
      var p2 = stroke.points[stroke.points.length - 1];

      if (selected && !stroke.selected) continue;

      if (stroke !== element && stroke.fill === element.fill) {
        if (last.x == p1.x && last.y == p1.y) {
          element.points.pop();
          stroke.points.shift();
          element.points = element.points.concat(stroke.points);
          removeList.push(stroke);
          if (stroke.selected) this.selection.remove(stroke);
        } else if (first.x == p2.x && first.y == p2.y) {
          element.points.shift();
          stroke.points.pop();
          element.points = stroke.points.concat(element.points);
          removeList.push(stroke);
          if (stroke.selected) this.selection.remove(stroke);
        }
      }
    }
    if (removeList.length) this.frame.removeStrokes(removeList);
  },

  select: function(stroke) {
    if (stroke) {
      this.selection.add(stroke);
      this.fuse(stroke, true);
    }
  },

  deselect: function(stroke) {
    if (stroke) {
      this.fuse(stroke);
      this.selection.remove(stroke);
    } else {
       if (!this.selection.isEmpty()) {
        var strokes = this.selection.elements.slice(0);
        this.selection.clear();
        // console.log('strokes', strokes);
        for (var i = 0; i < strokes.length; i++) {
          this.fuse(strokes[i]);
        }
      }
    }
  },

  _marqueeSelect: function(xmin, ymin, xmax, ymax) {
    var addList = [];
    var removeList = [];
    var selectList = [];

    var edges = [
      [ xmin, ymin, xmin, ymax ],
      [ xmin, ymin, xmax, ymin ],
      [ xmax, ymin, xmax, ymax ],
      [ xmin, ymax, xmax, ymax ]
      ];

    for (var i = 0; i < this.frame.strokes.length; i++) {
      var stroke = this.frame.strokes[i];

      if (stroke.selected) {
        // console.log(i);
        continue;
      }

      var isIntersected = false;
      var marking = false;
      var points = [];
      var inside = [];
      var outside = [];

      for (var j = 1; j < stroke.points.length; j++) {
        var p1 = stroke.points[j - 1];
        var p2 = stroke.points[j];

        points.push(p1.copy());

        if (j == 1) {
          if (Util.pointInRect(p1.x, p1.y, xmin, ymin, xmax, ymax)) {
            marking = true;
          }
        }

        var results = [];

        for (var k = 0; k < edges.length; k++) {
          var edge = edges[k];
          var result = Util.intersect(p1.x, p1.y, p2.x, p2.y, edge[0], edge[1], edge[2], edge[3]);
          if (result && result.seg1 && result.seg2) {
            results.push(result);
          }
        }

        if (results.length) isIntersected = true;

        results.sort(function(a, b) { return a.ua - b.ua; });

        for (var k = 0; k < results.length; k++) {
          var result = results[k];
          if (!marking) {
            points.push(new Point(result.x, result.y));
            outside.push(points);
            points = [ new Point(result.x, result.y) ];
            marking = true;
          } else {
            points.push(new Point(result.x, result.y));
            inside.push(points);
            points = [ new Point(result.x, result.y) ];
            marking = false;
          }
        }

        if (j === stroke.points.length - 1) points.push(p2.copy());
      }

      if (marking) {
        inside.push(points);
      } else {
        outside.push(points);
      }

      if (outside.length) {
        if (inside.length != 0) {
          for (var j = 0; j < outside.length; j++) {
            var s = new Stroke(outside[j], stroke.fill);
            addList.push(s);
          }
          for (var j = 0; j < inside.length; j++) {
            var s = new Stroke(inside[j], stroke.fill);
            addList.push(s);
            selectList.push(s);
          }
          removeList.push(stroke);
        }
      }
      else if (inside.length) {
        selectList.push(stroke);
      }

    }

    if (selectList.length) {
      if (removeList.length) this.frame.removeStrokes(removeList);
      if (addList.length) this.frame.addStrokes(addList);
      this.selection.add(selectList);

      var temp = this.selection.elements;
      for (var i = 0; i < temp.length; i++) {
        stroke = temp[i];
        this.fuse(stroke, true);
      }

      return true;
    }

    return false;
  },

  deleteSelected: function() {
    var strokes = this.selection.get();
    this.frame.removeStrokes(strokes);
    // sequence.addAction(new DeleteAction());
    this.selection.clear();
  },

  end: function() {
    this.go(this.frames.length - 1);
  },

  next: function() {
    this.go(this.position + 1);
  },

  previous: function() {
    this.go(this.position - 1);
  },

  go: function(index) {
    var frame = this.frames[index];
    if (frame) {
      this.deselect();
      // this.selection.clear();

      this.position = index;
      this.frame = frame;
      // window.selection = this.selection;
    }
  }
}

module.exports = Sequence;
