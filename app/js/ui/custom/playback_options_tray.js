const Tray = require('../tray');
const TrayButton = require('../tray_button');
const TextField = require('../text_field');

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

    this.fpsField = new TextField({ el: document.getElementById('playback-options-fps'), name: 'fps' })
    this.add(this.fpsField);

    this.fpsField.el.addEventListener('change', () => {
      this.emit('fps', this.fpsField);
    });

    this.fpsField.el.addEventListener('focus', () => {
      // this.fpsField.value = this.fpsField.value.substring(0, this.fpsField.value.length - 4);
    });
  }
}

module.exports = PlaybackOptionsTray;
