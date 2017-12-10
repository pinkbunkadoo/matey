const Color = require('./color')

var Const = {
  WIDTH: 640,
  HEIGHT: 400,

  color: {
    Stroke: new Color(64, 64, 64),
    // STROKE: 'rgb(32, 32, 32)',
    // strokeSelected: 'red',
    Selection: new Color(30, 144, 255),
    // WORKSPACE: 'rgb(180, 180, 180)',
    // WORKSPACE: 'rgb(160, 160, 160)',
    Workspace: new Color(240, 240, 238),
    Onion: new Color(128, 255, 128),
    Paper: new Color(240, 240, 238)
  },

  KEY_PAN: ' ',
  // LINE_WIDTH: 1.5,
  LINE_WIDTH: 1.2,
  ZOOM_LEVELS: [ 0.25, 0.5, 0.75, 1.0, 1.5, 2, 3, 5 ]
};

module.exports = Const;
