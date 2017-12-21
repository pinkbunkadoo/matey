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

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.pointerEvents = 'none';

    this.graphic = new Graphic(this.canvas);
    this.graphic.el.style.pointerEvents = 'none';
    this.add(this.graphic);

    this.numberContainer = new Container();
    this.numberContainer.addClass('frame-list-item-number');
    this.number = new Label({ title: '' });
    this.numberContainer.add(this.number);
    this.add(this.numberContainer);
  }

  setNumber(data) {
    this.el.dataset.index = data;
    this.number.setTitle(data);
  }

  select() {
    // this.numberContainer.el.style.background = 'dodgerblue';
    // this.numberContainer.el.style.color = 'white';
    // this.numberContainer.el.style.border = '0px solid dodgerblue'
    this.numberContainer.addClass('selected');
    this.addClass('selected');
    // this.highlight.el.style.opacity = 1;
  }


  deselect() {
    // this.numberContainer.el.style.background = 'rgba(0,0,0,0)';
    // this.numberContainer.el.style.color = 'gray';
    // this.numberContainer.el.style.border = '0px solid rgba(0,0,0,0)'
    this.numberContainer.removeClass('selected');
    this.removeClass('selected');
    // this.highlight.el.style.opacity = 1;
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
