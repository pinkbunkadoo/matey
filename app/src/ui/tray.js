const Base = require('./base');
const Container = require('./container');
const Label = require('./label');
const Icon = require('./icon');

class Tray extends Container {
  constructor(params={}) {
    super(params);
    this.addClass('tray');

    // this.tagIcon = new Base();
    // this.tagIcon.addClass('tray-tag');
    // this.add(this.tagIcon);
    this.titleContaner = new Container();
    this.titleLabel = new Label({ text: 'No Title' });
    this.titleLabel.addClass('tray-title');
    this.titleLabel.setStyle({ display: 'none' });
    this.add(this.titleLabel);

    this.container = new Container();
    this.container.addClass('tray-container');
    this.add(this.container);

    this.addClass('invert');

    this.el.addEventListener('focus', () => {
      console.log('tray focus');
    });
  }

  show() {
    super.show();
    this.emit('show');
  }

  hide() {
    super.hide();
    this.emit('hide');
  }

  setTitle(text) {
    this.titleLabel.set(text);
    this.titleLabel.setStyle({ display: 'initial' });
  }

  onFocus(event) {
    // console.log('tray focus');
  }

  onFocus(event) {
    // console.log('tray blur');
  }

  handleEvent(event) {
    if (event.type == 'mousedown') {
      this.onMouseDown(event);
    } else if (event.type == 'mouseup') {
      this.onMouseUp(event);
    } else if (event.type == 'mousemove') {
      this.onMouseMove(event);
    } else if (event.type == 'focus') {
      // this.onFocus(event);
    } else if (event.type == 'blur') {
      // this.onBlur(event);
    }

  }
}

module.exports = Tray;
