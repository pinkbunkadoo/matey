const Graphic = require('../graphic');
const Container = require('../container');
const Label = require('../label');
const Spacer = require('../spacer');

class FrameListItem extends Container {
  constructor(width, height) {
    super();

    this.addClass('frame-list-item');

    this.width = width;
    this.height = height;

    // this.canvas = document.createElement('canvas');
    // this.canvas.width = this.width;
    // this.canvas.height = this.height;
    // this.canvas.style.pointerEvents = 'none';

    this.numberContainer = new Container();
    this.numberContainer.addClass('frame-list-item-number');
    this.numberContainer.el.style.width = this.width + 'px';
    this.numberContainer.el.style.height = this.height + 'px';
    this.number = new Label({ text: '' });
    this.numberContainer.add(this.number);
    this.add(this.numberContainer);

    // this.space = new Container();
    // this.space.el.style.width = (this.width+1) + 'px';
    // this.space.el.style.height = (this.height+2) + 'px';
    // this.space.el.style.background = 'cyan';

    this.imageContainer = new Container();
    this.imageContainer.el.style.width = this.width + 'px';
    this.imageContainer.el.style.height = this.height + 'px';
    // this.imageContainer.el.style.background = 'yellow';
    this.imageContainer.el.style.pointerEvents = 'none';
    this.add(this.imageContainer);

    // this.el.appendChild(this.canvas);
    // this.add(this.space);
  }

  setNumber(data) {
    this.el.dataset.index = data;
    this.number.set(data);
  }

  select() {
    this.numberContainer.addClass('selected');
    this.addClass('selected');
  }

  deselect() {
    this.numberContainer.removeClass('selected');
    this.removeClass('selected');
  }

  setImage(image) {
    // console.log('setTimage', this.el.dataset.index);
    // this.imageContainer.clear();
    // this.imageContainer.add(image);
    if (this.imageContainer.el.firstChild)
      this.imageContainer.el.removeChild(this.imageContainer.el.firstChild);
    this.imageContainer.el.appendChild(image);
  }

  handleEvent(event) {
    // console.log('handle');
    if (event.type === 'click') {
      // console.log('click');
      // this.emit('select', this);
    }
  }
}

module.exports = FrameListItem;
