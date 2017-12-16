const Color = require('./color')

var Const = {
  WIDTH: 640,
  HEIGHT: 400,

  COLOR_STROKE: new Color(64, 64, 64),
  COLOR_SELECTION: new Color(30, 144, 255),
  COLOR_WORKSPACE: new Color(250, 250, 250),
  COLOR_ONION: new Color(128, 255, 128),
  COLOR_PAPER: new Color(255, 255, 255),

  KEY_PAN: ' ',
  // LINE_WIDTH: 1.5,
  LINE_WIDTH: 1.2,
  ZOOM_LEVELS: [ 0.25, 0.5, 0.75, 1.0, 1.5, 2, 3, 5 ]
};

module.exports = Const;
