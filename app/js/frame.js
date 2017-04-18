const History = require('./history');
const Selection = require('./selection');
const Fragment = require('./fragment');
const Stroke = require('./stroke');

function Frame() {
  this.strokes = [];
  this.snapshot = [];
  this.selection = new Selection();
  this.history = new History();
}

Frame.prototype.constructor = Frame;

Frame.prototype = {
  copy: function() {
    var frame = new Frame();
    for (var i = 0; i < this.strokes.length; i++) {
      var stroke = this.strokes[i];
      frame.addStroke(stroke.copy());
    }
    return frame;
  },

  focus: function() {

  },

  blur: function() {
    // this.selection.clear();
  },

  addStroke: function(stroke) {
    this.strokes.push(stroke);
  },

  removeStroke: function(stroke) {
    var index = this.strokes.indexOf(stroke);
    if (index != -1) {
      this.strokes.splice(index, 1);
    }
  },

  pointsFromFragment: function(fragment) {
    var stroke = fragment.stroke;
    var startOffset = fragment.start - (fragment.start >> 0);
    var endOffset = fragment.end - (fragment.end >> 0);

    var start = fragment.start >> 0;
    var end = fragment.end >> 0;

    var p1 = stroke.points[start];
    var p2 = stroke.points[start + 1];

    var x = p1.x + startOffset * (p2.x - p1.x);
    var y = p1.y + startOffset * (p2.y - p1.y);

    var points = [];
    points.push(new Point(x, y));

    for (var i = start + 1; i <= end; i++) {
      var p = stroke.points[i];
      points.push(new Point(p.x, p.y));
    }

    if (endOffset) {
      p1 = stroke.points[end];
      p2 = stroke.points[end + 1];
      x = p1.x + endOffset * (p2.x - p1.x);
      y = p1.y + endOffset * (p2.y - p1.y);
      points.push(new Point(x, y));
    }

    return points;
  },

  deleteSelected: function() {
    var strokes = [];

    for (var i = 0; i < this.selection.fragments.length; i++) {
      var fragment = this.selection.fragments[i];
      strokes.push(fragment.stroke);
      if (!fragment.inside) {
        app.addStroke(new Stroke(this.pointsFromFragment(fragment)));
      }
    }

    for (var i = 0; i < strokes.length; i++) {
      app.removeStroke(strokes[i]);
    }

    this.selection.clear();
  },

  selectStroke: function(stroke) {
    var fragment = new Fragment(stroke, 0, stroke.points.length - 1, true);
    this.selection.add(fragment);
  },

  setStrokes: function(strokes) {
    this.strokes = [];
    for (var i = 0; i < strokes.length; i++) {
      var stroke = strokes[i].copy();
      this.strokes.push(stroke);
    }
  },

  invertSelection: function() {
    for (var i = 0; i < this.selection.fragments.length; i++) {
      var fragment = this.selection.fragments[i];
      fragment.inside = !fragment.inside;
    }
  },

  clearSelection: function() {
    this.selection.clear();
  },

  select: function(region) {
    if (region === null) {
      this.selection.clear();
      return;
    }
    var xmin = region.x;
    var ymin = region.y;
    var xmax = xmin + region.width;
    var ymax = ymin + region.height;
    var edges = [
      [ xmin, ymin, xmin, ymax ],
      [ xmin, ymin, xmax, ymin ],
      [ xmax, ymin, xmax, ymax ],
      [ xmin, ymax, xmax, ymax ]
      ];

    for (var i = 0; i < this.strokes.length; i++) {
      var stroke = this.strokes[i];
      var marking = false;
      var start = 0, end = 0;

      for (var j = 1; j < stroke.points.length; j++) {
        var p1 = stroke.points[j - 1];
        var p2 = stroke.points[j];

        if (j == 1) {
          if (util.pointInRect(p1.x, p1.y, xmin, ymin, xmax, ymax)) {
            start = 0;
            marking = true;
          }
        }

        var results = [];

        for (var k = 0; k < edges.length; k++) {
          var edge = edges[k];
          var result = util.intersect(p1.x, p1.y, p2.x, p2.y, edge[0], edge[1], edge[2], edge[3]);
          if (result && result.seg1 && result.seg2) {
            results.push(result);
          }
        }

        results.sort(function(a, b) { return a.ua - b.ua; });

        for (var k = 0; k < results.length; k++) {
          var result = results[k];
          if (!marking) {
            this.selection.add(new Fragment(stroke, start, (j - 1) + result.ua, marking));
            start = (j - 1) + result.ua;
            marking = true;
          } else {
            this.selection.add(new Fragment(stroke, start, (j - 1) + result.ua, marking));
            start = (j - 1) + result.ua;
            marking = false;
          }
        }

        if (j == stroke.points.length - 1) end = j;
      }

      if (start !== end) {
        if (start == 0 && end == stroke.points.length - 1 && !marking) {
        } else {
          this.selection.add(new Fragment(stroke, start, end, marking));
          marking = false;
        }
      }
    }
  },

  historyBack: function() {
    var index = this.history.back();
    if (index == -1) {
      app.setStrokes(this.snapshot);
    } else {
      var action = this.history.get();
      action.do();
    }
  },

  historyForward: function() {
    var index = this.history.forward();
    if (index > -1) {
      var action = this.history.get();
      action.do();
    }
    // if (action) action.redo();
  },

  drawExtras: function(ctx) {
    ctx.lineWidth = LINE_WIDTH * 2 * app.scale;

    for (var i = 0; i < this.selection.fragments.length; i++) {
      var fragment = this.selection.fragments[i];
      var stroke = fragment.stroke;
      var points = stroke.points;

      var startOffset = fragment.start - (fragment.start >> 0);
      var endOffset = fragment.end - (fragment.end >> 0);

      var start = fragment.start >> 0;
      var end = fragment.end >> 0;

      var p1 = points[start];
      var p2 = points[start + 1];

      var x = p1.x + startOffset * (p2.x - p1.x);
      var y = p1.y + startOffset * (p2.y - p1.y);

      var p = app.worldToScreen(x, y);

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);

      for (var j = start + 1; j <= end; j++) {
        p = points[j];
        p = app.worldToScreen(p.x, p.y);
        ctx.lineTo(p.x, p.y);
      }

      if (endOffset) {
        p1 = points[end];
        p2 = points[end + 1];
        x = p1.x + endOffset * (p2.x - p1.x);
        y = p1.y + endOffset * (p2.y - p1.y);
        p = app.worldToScreen(x, y);
        ctx.lineTo(p.x, p.y);
      }

      ctx.strokeStyle = fragment.inside ? 'dodgerblue' : 'pink';

      ctx.stroke();
    }
  },

  draw: function(ctx) {
    ctx.lineCap = 'butt';
    ctx.lineWidth = app.scale < 1 ? 1 :  LINE_WIDTH * app.scale;
    ctx.strokeStyle = COLOR_STROKE;

    for (var i = 0; i < this.strokes.length; i++) {
      var stroke = this.strokes[i];
      app.createPath(ctx, stroke.points);
      ctx.stroke();
    }

  }

}

module.exports = Frame;
