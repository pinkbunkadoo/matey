const Container = require('../container');
const Tray = require('../tray');
const TrayButton = require('../tray_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');

class ControlsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.playButton = new TrayButton({ el: document.getElementById('controls-tray-play'), name: 'play' });
    this.playButton.on('pressed', () => {
      this.playButton.toggle();
      this.emit('play', this.playButton);
    });
    this.add(this.playButton);

    this.buttons = [];
    // this.buttons['loop'] = new TrayButton({ el: document.getElementById('controls-loop'), name: 'loop' });
    // this.buttons['onion'] = new TrayButton({ el: document.getElementById('controls-onion'), name: 'onion' });
    //
    // this.buttons['loop'].on('pressed', () => {
    //   this.buttons['loop'].toggle();
    //   this.emit('loop', this.buttons['loop']);
    // });
    // this.buttons['onion'].on('pressed', () => {
    //   this.buttons['onion'].toggle();
    //   this.emit('onion', this.buttons['onion']);
    // });

  }

  setPlaying(value) {
    this.playButton.setState(value);
  }
}

module.exports = ControlsTray;
