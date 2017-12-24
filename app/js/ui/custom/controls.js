const Base = require('../base');
const Container = require('../container');
const Label = require('../label');
const TextField = require('../text_field');
const Tray = require('../tray');
const Button = require('../button');

class Controls extends Tray {
  constructor() {
    super();

    this.el = document.getElementById('controls');

    this.buttons = [];
    this.buttons['first'] = new Button({id: 'controls-first', fromDOMElement: true});
    this.buttons['play'] = new Button({id: 'controls-play', fromDOMElement: true});
    this.buttons['last'] = new Button({id: 'controls-last', fromDOMElement: true});
    this.buttons['loop'] = new Button({id: 'controls-loop', fromDOMElement: true});
    this.buttons['onion'] = new Button({id: 'controls-onion', fromDOMElement: true});

    this.buttons['first'].on('pressed', () => {
      app.first();
    });
    this.buttons['play'].on('pressed', () => {  });
    this.buttons['last'].on('pressed', () => {
      app.last();
    });
    this.buttons['loop'].on('pressed', () => {
      this.buttons['loop'].toggle();
      console.log('loop', this.buttons['loop'].state);
    });
    this.buttons['onion'].on('pressed', () => {
      this.buttons['onion'].toggle();
      this.emit('onion', this.buttons['onion'].state);
      console.log('onion', this.buttons['onion'].state);
    });

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = (16 * app.unit) + 'px';
      this.buttons[name].el.style.height = (16 * app.unit) + 'px';
    }

    this.frameNumber = 1;

    this.frameInput = new TextField({ id: 'controls-frame', fromDOMElement: true });
    this.frameInput.on('change', (value) => {
      if (isNaN(value)) {
        console.log(value, 'isn\'t a number.');
        this.frameInput.render({ cmd: 'show', value: this.frameNumber });
      } else {
        let n = parseInt(value);
        if (Number.isInteger(n)) {
          this.emit('frame-change', n);
        } else {
          this.frameInput.render({ cmd: 'show', value: this.frameNumber });
        }
      }
    });

    this.fps = 1;

    this.fpsInput = new TextField({ id: 'controls-fps', fromDOMElement: true });
    this.fpsInput.on('change', (value) => {
      if (isNaN(value)) {
        console.log(value, 'isn\'t a number.');
        this.fpsInput.render({ cmd: 'show', value: this.fps });
      } else {
        let n = parseInt(value);
        if (Number.isInteger(n)) {
          this.emit('fps-change', n);
        } else {
          this.fpsInput.render({ cmd: 'show', value: this.fps });
        }
      }
    });

    // this.frameLabel = new Label({ id: 'controls-frame-label', fromDOMElement: true });
  }

  setFrame(value, total) {
    this.frameNumber = value;
    this.frameInput.render({ cmd: 'show', value: this.frameNumber });
    // this.frameLabel.render({ cmd: 'show', value: '&hellip; ' + total });
  }

  setFps(value) {
    this.fps = value;
    this.fpsInput.render({ cmd: 'show', value: this.fps });
  }

}

module.exports = Controls;
