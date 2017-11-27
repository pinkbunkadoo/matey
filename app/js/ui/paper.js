const Const = require('../const');
const Point = require('../geom/point');
const Base = require('./base');

const Tools = require('../tools/');
// const Emitter = require('../emitter');
const Stroke = require('../display/stroke');

function Paper(params) {
  params = params || {};
  Base.call(this);

  this.addClass('paper');

  this.canvasWidth = params.width;
  this.canvasHeight = params.height;

  this.canvas = document.createElement('canvas');
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;
  this.canvas.style.pointerEvents = 'none';
  // this.canvas.style.zIndex = -100;
  this.el.appendChild(this.canvas);


  this.scale = 1.0;
  this.width = Const.WIDTH;
  this.height = Const.HEIGHT;

  this.bitmap = document.createElement('canvas');
  this.bitmap.width = this.width;
  this.bitmap.height = this.height;

  this.tx = 0;
  this.ty = 0;

  this.tx = (this.width / 2) >> 0;
  this.ty = (this.height / 2) >> 0;

  // this.showDots = false;
  // this.showOnion = false;

  this.globalAlpha = 1.0;
  // this.stroke

  // this.renderList = [];

  // var self = this;

  // this.render();
}

Paper.prototype = Object.create(Base.prototype);
Paper.prototype.constructor = Paper;

// Paper.prototype.setOnion = function(value) {
//   // console.log('setOnion', value);
//   this.showOnion = value;
// }

Paper.prototype.resize = function(width, height) {
  this.canvasWidth = width;
  this.canvasHeight = height;
  this.canvas.width = this.canvasWidth;
  this.canvas.height = this.canvasHeight;
  // this.bitmap.width = this.canvasWidth;
  // this.bitmap.height = this.canvasHeight;
  // this.render();
}

Paper.prototype.setCameraPosition = function(x, y) {
  this.tx = x;
  this.ty = y;
  // this.render();
  // this.draw();
}

Paper.prototype.center = function() {
  this.setCameraPosition((this.width / 2) >> 0, (this.height / 2) >> 0);
  this.setZoom(1);
}

Paper.prototype.panCameraBy = function(x, y) {
  this.setCameraPosition(this.tx + x, this.ty + y);
}

Paper.prototype.setZoom = function(value) {
  // console.log('setZoom');
  if (value <= 5 && value >= 0.05) {
    this.scale = ((value * 100) >> 0) / 100;
    if (this.scale == 1) {
      this.tx = this.tx >> 0;
      this.ty = this.ty >> 0;
    }
    // this.render();
    // this.emit('zoom', { scale: this.scale });
  }
}

Paper.prototype.zoomIn = function() {
  // console.log('zoomIn', this.scale, Const.ZOOM_LEVELS);
  var self = this;
  var level = Const.ZOOM_LEVELS.find(function(element) {
    return element > self.scale;
  });
  // console.log(level);
  if (level) this.setZoom(level);
}

Paper.prototype.zoomOut = function() {
  var level;
  for (var i = Const.ZOOM_LEVELS.length - 1; i >= 0; i--) {
    level = Const.ZOOM_LEVELS[i]
    if (level < this.scale) break;
  }
  if (level) this.setZoom(level);
}

Paper.prototype.zoomCameraBy = function(x) {
  var value = this.scale;
  value = value + x;
  this.setZoom(value);
}

Paper.prototype.screenToWorld = function(x, y) {
  var widthHalf = (this.canvas.width / 2) >> 0;
  var heightHalf = (this.canvas.height / 2) >> 0;
  // var widthHalf = (this.canvas.width / 2);
  // var heightHalf = (this.canvas.height / 2);

  var px = x - widthHalf;
  var py = y - heightHalf;

  var sx = px / this.scale;
  var sy = py / this.scale;

  var tx = sx + this.tx;
  var ty = sy + this.ty;

  return new Point(tx, ty);
}

Paper.prototype.worldToScreen = function(x, y) {
  var tx = x - (this.tx);
  var ty = y - (this.ty);

  var sx = (tx * this.scale);
  var sy = (ty * this.scale);

  var widthHalf = (this.canvas.width / 2) >> 0;
  var heightHalf = (this.canvas.height / 2) >> 0;
  // var widthHalf = (this.canvas.width / 2);
  // var heightHalf = (this.canvas.height / 2);

  return new Point(sx + widthHalf, sy + heightHalf);
}

// Paper.prototype.addRenderObject = function(object) {
//   this.renderList.push(object);
// }

// Paper.prototype.addRenderObjects = function(objects) {
//   for (var i = 0; i < objects.length; i++) {
//     this.renderList.push(objects[i]);
//   }
// }

Paper.prototype.renderDots = function(stroke) {
  var ctx = this.canvas.getContext('2d');
  ctx.lineWidth = 1;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';

  for (var j = 0; j < stroke.points.length; j++) {
    var p = stroke.points[j];
    p = this.worldToScreen(p.x, p.y);
    var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
    ctx.beginPath();
    // ctx.rect(x - 1, y - 1, 3, 3);
    ctx.rect(x - 1, y - 1, 2, 2);
    ctx.fill();
    ctx.stroke();
  }
}


// Paper.prototype.drawLine = function(x1, y1, x2, y2, options) {
//   // var ctx = this.canvas.getContext('2d');
//
//   // ctx.beginPath();
//
//   // var point = points[i];
//   // var x = point.x, y = point.y;
//   //
//   // if (!screen) {
//   //   var p = this.worldToScreen(x, y);
//   //   x = p.x, y = p.y;
//   // }
//
//   var p1 = this.screenToWorld(x1, y1);
//   var p2 = this.screenToWorld(x2, y2);
//
//   var ctx = this.bitmap.getContext('2d');
//
//   ctx.moveTo(x1, y1);
//   ctx.lineTo(x2, y2);
//
//   // if (points.length == 2) ctx.closePath();
//
//   ctx.strokeStyle = 'lightblue';
//   ctx.stroke();
// }


Paper.prototype.renderPath = function(points, options) {
  var ctx = this.canvas.getContext('2d');
  // var dx = 0, dy = 0;
  // var points = stroke.points;
  options = options || {};

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // var alpha = (options.alpha != undefined ? options.alpha : 1.0);
  var screen = (options.screen != undefined ? options.screen : false);
  var fill = (options.fill ? options.fill : null);
  var strokeStyle = (options.strokeStyle != undefined ? options.strokeStyle : Const.color.STROKE);
  var lineWidth = (options.lineWidth != undefined ? options.lineWidth : Const.LINE_WIDTH);

  // console.log('renderStroke', points);
  // ctx.setTransform(1, 0, 0, 1, 0.5, 0.5);

  ctx.beginPath();

  for (var i = 0; i < points.length; i++) {
    var point = points[i];
    var x = point.x, y = point.y;

    if (!screen) {
      var p = this.worldToScreen(x, y);
      x = p.x, y = p.y;
    }
    // var x = p.x + dx + 0.5, y = p.y + dy + 0.5;
    // var x = p.x + dx, y = p.y + dy;
    // var x = p.x, y = p.y;

    if (i == 0)
      ctx.moveTo(x, y);
    else
      ctx.lineTo(x, y);
  }

  // if (points.length == 2) ctx.closePath();

  if (fill) {
    // ctx.fillStyle = stroke.selected ? 'rgba(30, 144, 255, 0.5)' : 'white';
    // ctx.globalAlpha = 0.5;
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // ctx.globalAlpha = this.globalAlpha;
  ctx.lineWidth = lineWidth; //Const.LINE_WIDTH;
  // ctx.strokeStyle = stroke.selected ? 'dodgerblue' : Const.color.STROKE;
  // ctx.strokeStyle = Const.color.STROKE;
  ctx.strokeStyle = strokeStyle;
  ctx.stroke();

  // ctx.setTransform(1, 0, 0, 1, 0, 0);
}


Paper.prototype.getBitmapContext = function() {
  return this.bitmap.getContext('2d');
}


Paper.prototype.renderBitmap = function() {
  var p1 = this.worldToScreen(0, 0);
  var ctx = this.canvas.getContext('2d');
  ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(this.bitmap, p1.x, p1.y, this.width * this.scale, this.height * this.scale);
  ctx.globalCompositeOperation = 'source-over';
}


Paper.prototype.clear = function() {
  var ctx = this.canvas.getContext('2d');
  // ctx.save();
  ctx.fillStyle = Const.color.WORKSPACE;
  ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  // ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

  var p1 = this.worldToScreen(0, 0);
  ctx.fillStyle = Const.color.PAPER;
  ctx.fillRect(p1.x >> 0, p1.y >> 0, this.width * this.scale, this.height * this.scale);

  // if (objects) {
  //   for (var i = 0; i < objects.length; i++) {
  //     var obj = objects[i];
  //     if (obj instanceof Stroke) {
  //       ctx.save();
  //       this.renderStroke(ctx, obj);
  //
  //       // var p = this.worldToScreen(obj.points[0].x, obj.points[0].y);
  //       // ctx.fillStyle = 'red';
  //       // ctx.font = '9px Roboto';
  //       // ctx.fillText(i, p.x, p.y - 5);
  //
  //       ctx.restore();
  //     }
  //   }
  // }
  //
  // if (this.overlay) {
  //   ctx.drawImage(this.overlay, 0, 0);
  //   var overlayContext = this.overlay.getContext('2d');
  //   overlayContext.clearRect(0, 0, this.overlay.width, this.overlay.height);
  // }
  // // if (this.tool) this.tool.render(ctx);
  //
  // if (this.showOnion) {
  //   ctx.fillStyle = 'blue';
  //   ctx.font = '9px Roboto';
  //   ctx.fillText('Onion', 100, 100);
  // }
  //
  // if (this.showDots) {
  //   ctx.lineWidth = 1;
  //   ctx.fillStyle = 'white';
  //   ctx.strokeStyle = 'black';
  //
  //   if (objects) {
  //     for (var i = 0; i < objects.length; i++) {
  //       var stroke = objects[i];
  //       for (var j = 0; j < stroke.points.length; j++) {
  //         var p = stroke.points[j];
  //         p = this.worldToScreen(p.x, p.y);
  //         var x = (p.x >> 0) + 0.5, y = (p.y >> 0) + 0.5;
  //         ctx.beginPath();
  //         ctx.rect(x - 1, y - 1, 3, 3);
  //         ctx.fill();
  //         ctx.stroke();
  //       }
  //     }
  //   }
  // }
  //
  // ctx.restore();
}

// Paper.prototype.draw = function() {
  // this.render();

  // if (this.sequence.position > 0 && this.onion) {
  //   ctx.globalAlpha = 0.25;
  //   this.drawFrame(ctx, this.sequence.frames[this.sequence.position - 1]);
  //   ctx.globalAlpha = 1;
  // }

  // this.drawFrame(ctx, this.sequence.frame);

  // if (app.tool) {
  //   ctx.save();
  //   app.tool.draw(ctx);
  //   ctx.restore();
  // }


// }

Paper.prototype.onMouseDown = function(event) {
  // if (event.target === this.el) {
  //   if (this.mode === 'pan') {
  //     // this.setMode('pan');
  //
  //   } else {
  //     this.tool.handleEvent(event);
  //   }
  // }

}

Paper.prototype.onMouseMove = function(event) {
  // if (this.mode === 'pan') {
  //   if (event.buttons === 1) {
  //     this.panCameraBy(-app.mouseDeltaX / this.scale, -app.mouseDeltaY / this.scale);
  //     this.render();
  //   }
  // } else {
  //   this.tool.handleEvent(event);
  // }
}

Paper.prototype.onMouseUp = function(event) {
  // if (this.mode === 'pan') {
  //   if (!app.key[Const.KEY_DRAG] && event.button === 0) {
  //     this.setMode('tool');
  //   }
  // } else {
  //   if (this.tool) this.tool.handleEvent(event);
  // }
}

Paper.prototype.onKeyDown = function(event) {
  // if (event.key === Const.KEY_DRAG) {
  //   event.preventDefault();
  //   if (!event.repeat) {
  //     if (!app.mouseLeft) {
  //       this.setMode('pan');
  //     }
  //   }
  // }
  // else if (event.key === 'd' && !event.repeat) {
  //   this.showDots = !this.showDots;
  //   this.render();
  // }
  // else if (event.key === 'h' && !event.repeat) {
  //   this.center();
  //   this.render();
  // }
  // else {
  //   if (this.tool) this.tool.handleEvent(event);
  // }
}

Paper.prototype.onKeyUp = function(event) {
  // if (event.key === Const.KEY_DRAG) {
  //    if (!app.mouseLeft) {
  //      this.setMode('tool');
  //    }
  // } else {
  //   if (this.tool) this.tool.handleEvent(event);
  // }
}

Paper.prototype.handleEvent = function(event) {
  if (event.type === 'mousedown') {
    this.onMouseDown(event);
  }
  else if (event.type === 'mousemove') {
    this.onMouseMove(event);
  }
  else if (event.type === 'mouseup') {
    this.onMouseUp(event);
  }
  else if (event.type === 'keydown') {
    this.onKeyDown(event);
  }
  else if (event.type === 'keyup') {
    this.onKeyUp(event);
  }

}

module.exports = Paper;
