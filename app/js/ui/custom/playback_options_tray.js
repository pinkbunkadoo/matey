const Tray = require('../tray');
const TrayButton = require('../tray_button');

class PlaybackOptionsTray extends Tray {
  constructor(params={}) {
    super(params);

    this.buttons = [];
    this.buttons['loop'] = new TrayButton({ el: document.getElementById('playback-options-loop'), name: 'loop', width: 1.6, height: 1.6, padding: 1 });
    this.buttons['onion'] = new TrayButton({ el: document.getElementById('playback-options-onion'), name: 'onion', width: 1.6, height: 1.6, padding: 1 });

    this.buttons['loop'].on('pressed', () => {
      // console.log('loop');
      this.buttons['loop'].toggle();
      this.emit('loop', this.buttons['loop']);
    });
    this.buttons['onion'].on('pressed', () => {
      this.buttons['onion'].toggle();
      this.emit('onion', this.buttons['onion']);
    });

    console.log();
  }
}

module.exports = PlaybackOptionsTray;
