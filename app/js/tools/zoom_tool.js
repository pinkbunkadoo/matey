var Tool = require('./tool.js');

function ZoomTool() {
  Tool.call(this, 'zoom');
}

ZoomTool.prototype = Object.create(Tool.prototype);
ZoomTool.prototype.constructor = ZoomTool;

ZoomTool.prototype.focus = function() {
  app.setCursor('zoomin');
}

ZoomTool.prototype.onKeyDown = function(event) {
  if (event.altKey) {
    app.setCursor('zoomout');
  }
}

ZoomTool.prototype.onKeyUp = function(event) {
  if (event.altKey == false) {
    app.setCursor('zoomin');
  }
}

ZoomTool.prototype.onMouseMove = function(event) {
}

ZoomTool.prototype.onMouseOut = function(event) {}

ZoomTool.prototype.onMouseOver = function(event) {}

ZoomTool.prototype.onMouseDown = function(event) {
  if (event.altKey) {
    app.zoomOut();
    // app.zoomCameraBy(-0.25);
  } else {
    app.zoomIn();
    // app.zoomCameraBy(0.25);
  }
}

ZoomTool.prototype.onMouseUp = function(event) {
}


module.exports = ZoomTool;
