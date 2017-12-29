const Base = require('../base');
const Container = require('../container');
const Label = require('../label');
const TextField = require('../text_field');
const Panel = require('../panel');
const Button = require('../button');

class Controls extends Panel {
  constructor(params={}) {
    params.el = document.getElementById('controls');
    super(params);

    this.buttons = [];
    this.buttons['first'] = new Button({ el: document.getElementById('controls-first'), name: 'first' });
    this.buttons['play'] = new Button({ el: document.getElementById('controls-play'), name: 'play' });
    this.buttons['last'] = new Button({ el: document.getElementById('controls-last'), name: 'last' });
    this.buttons['loop'] = new Button({ el: document.getElementById('controls-loop'), name: 'loop' });
    this.buttons['onion'] = new Button({ el: document.getElementById('controls-onion'), name: 'onion' });

    this.buttons['first'].on('click', () => {
      // app.first();
      this.emit('first');
    });
    this.buttons['play'].on('click', () => {  });
    this.buttons['last'].on('click', () => {
      // app.last();
      this.emit('last');
    });
    this.buttons['loop'].on('click', () => {
      this.buttons['loop'].toggle();
    });
    this.buttons['onion'].on('click', () => {
      this.buttons['onion'].toggle();
      this.emit('onion', this.buttons['onion'].state);
    });

    for (let name in this.buttons) {
      // this.buttons[name].el.style.width = (25 * app.unit) + 'px';
      // this.buttons[name].el.style.height = (20 * app.unit) + 'px';
    }

    this.frameNumber = 1;

    this.frameInput = new TextField({ el: document.getElementById('controls-frame'), name: 'frame', width: '2em' });
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

    this.fpsInput = new TextField({ el: document.getElementById('controls-fps'), name: 'fps', width: '1.4em' });
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

    this.frameLabel = new Label({ el: document.getElementById('controls-frame-label'), name: 'frame-label' });

    // this.el.onresize = () => {
    //   console.log('resize');
    // };
  }

  setFrame(value, total) {
    // console.log('setframe', value, total);
    this.frameNumber = value;
    this.frameInput.render({ cmd: 'show', value: this.frameNumber });
    this.frameLabel.render({ cmd: 'show', value: 'o\' ' + total });
  }

  setFps(value) {
    this.fps = value;
    this.fpsInput.render({ cmd: 'show', value: this.fps });
  }

}

module.exports = Controls;
