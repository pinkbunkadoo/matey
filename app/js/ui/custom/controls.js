const Base = require('../base');
const Container = require('../container');
const Button = require('../button');

class Controls extends Container {
  constructor(el) {
    super(el);

    this.buttons = [];
    this.buttons['first'] = new Button(this.el.querySelector('#control-first'));
    this.buttons['play'] = new Button(this.el.querySelector('#control-play'));
    this.buttons['last'] = new Button(this.el.querySelector('#control-last'));
    this.buttons['loop'] = new Button(this.el.querySelector('#control-loop'));
    this.buttons['onion'] = new Button(this.el.querySelector('#control-onion'));

    this.buttons['first'].on('pressed', () => {  });
    this.buttons['play'].on('pressed', () => {  });
    this.buttons['last'].on('pressed', () => {  });
    this.buttons['loop'].on('pressed', () => {
      this.buttons['loop'].toggle();
      console.log('loop', this.buttons['loop'].state);
    });
    this.buttons['onion'].on('pressed', () => {
      this.buttons['onion'].toggle();
      console.log('onion', this.buttons['onion'].state);
    });

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = '2em';
      this.buttons[name].el.style.height = '2em';
    }
  }
}

module.exports = Controls;
