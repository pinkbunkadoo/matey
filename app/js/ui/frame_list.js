const Base = require('./base');
const Mouse = require('../mouse');
const Container = require('./container');
const Spacer = require('./spacer');
const Divider = require('./divider');
const Label = require('./label');
const Icon = require('./icon');
const Button = require('./button');
const Scroller = require('./scroller');

const FrameListItem = require('./frame_list_item');
const Frame = require('../frame');

class FrameList extends Container {
  constructor(el) {
    super(el);

    // this.addClass('frame-list');

    // this.width = params.width || 128;
    // this.height = params.height || 80;

    this.items = [];
    this.selection = null;

    // this.frameListContainer = new Container();
    // this.frameListContainer.addClass('frame-list');

    this.container = new Container(this.el.querySelector('#frame-list-container'));
    this.add(this.container);

    // this.add(this.frameListContainer);

    // this.el.addEventListener('mousedown', function(event) {
    //   console.log('mousedown frame-list');
    // });
    this.thumbnailWidth = 32;
    this.thumbnailHeight = 32;

    this.frameListNew = new Container();
    this.frameListNew.addClass('frame-list-new');
    this.frameListNew.el.onclick = () => {
      this.emit('new-frame');
    };
    let icon = new Icon({ resource: 'plus', invert: true });
    icon.el.style.width = '24px';
    icon.el.style.height = '24px';
    this.frameListNew.add(icon);

    this.items.push(this.frameListNew);
    this.container.add(this.frameListNew);

    this.grab = false;
    this.dragAmount = 0;
    this.capture = false;
    this.velocity = 0;
    this.timerId = null;

    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('wheel', this);
    // this.el.addEventListener('blur', this);
  }

  // FrameList.prototype.notifyChange = function(params) {
  //   if (this.onChange) {
  //     this.onChange(params);
  //   }
  // }
  //
  refreshFrameNumbers() {
    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item instanceof FrameListItem) {
        item.setNumber(i + 1);
      }
    }
  }

  addFrame() {
    this.insertFrame(this.items.length-1);
  }

  insertFrame(index) {
    let frameListItem = new FrameListItem(this.thumbnailWidth, this.thumbnailHeight);
    frameListItem.on('select', (item) => {
      this.emit('select', { index: this.items.indexOf(item) });
    });
    this.items.splice(index, 0, frameListItem);
    this.container.insert(index, frameListItem);
    this.refreshFrameNumbers();
  }

  removeFrame(index) {
    this.container.remove(this.items[index]);
    this.items.splice(index, 1);
    this.refreshFrameNumbers();
  }

  removeAll() {
    this.clear();
    this.items = [];
    this.selection = null;
  }

  get(index) {
    return this.items[index];
  }

  select(index) {
    // console.log('select', index);
    if (this.selection) {
      this.selection.removeClass('selected');
      this.selection.deselect();
    }

    this.selection = this.items[index];
    this.selection.addClass('selected');

    this.selection.select();

    var item = this.selection;

    var width = this.container.el.scrollWidth;

    if (item.el.offsetLeft + item.el.offsetWidth > this.el.scrollLeft + this.el.offsetWidth) {
      this.el.scrollLeft = item.el.offsetLeft - this.el.offsetWidth + item.el.offsetWidth;

    } else if (item.el.offsetLeft < this.el.scrollLeft) {
      this.el.scrollLeft = item.el.offsetLeft;
    }

    // console.log(index, this.items.length-1);

    if (index === this.items.length - 2) {
      // console.log('hi');
      this.el.scrollLeft = this.frameListNew.el.offsetLeft;
      // console.log(this.frameListNew.el.clientWidth);
    } else if (index === 0) {
      this.el.scrollLeft = 0;
    }
  }

  adjust(params) {
    // this.scroller.adjust({ page: this.el.offsetWidth, total: this.frameContainer.el.scrollWidth });
    // console.log();
  }

  setThumbnailSize(width, height) {
    this.thumbnailWidth = width;
    this.thumbnailHeight = height;
    this.frameListNew.el.style.width = this.thumbnailWidth + 'px';
    this.frameListNew.el.style.height = this.thumbnailHeight + 'px';
  }

  render(params) {
    if (params.cmd === 'select') {
      this.select(params.index);
    }
    else if (params.cmd === 'frameAdd') {
      this.addFrame();
    }
    else if (params.cmd === 'frameInsert') {
      this.insertFrame(params.index);
    }
    else if (params.cmd === 'frameRemove') {
      this.removeFrame(params.index);
    }
    else if (params.cmd === 'removeAll') {
      this.removeAll();
    }
    else if (params.cmd === 'update') {
      // this.frameIndicator.setTitle(params.index + ' / ' + params.total);
      // FrameListBar.prototype.setFrame = function(value1, value2) {
      //   this.frame.setTitle(value1 + ' / ' + value2);
      // }
    }
    // this.scroller.adjust({ page: this.el.offsetWidth, total: this.frameContainer.el.scrollWidth });
  }

  beginMouseCapture() {
    this.capture = true;
    window.addEventListener('mouseup', this);
    window.addEventListener('mousemove', this);
    window.addEventListener('blur', this);
  }

  endMouseCapture() {
    this.capture = false;
    window.removeEventListener('mouseup', this);
    window.removeEventListener('mousemove', this);
    window.removeEventListener('blur', this);
  }

  onBlur(event) {
    this.endMouseCapture();
  }

  onMouseDown(event) {
    // console.log('down');

    var target = event.target;

    this.dragAmount = 0;

    // this.el.addEventListener('mouseup', this);
    this.beginMouseCapture();

    // this.el.setCapture(true);

    // console.log();
    // console.log('down', target);

    // if (target === this.el) {
    //   console.log('down');
    //
    // } else if (target.data !== undefined) {
    //   this.emit('select', { index: parseInt(target.data) - 1 });
    // }

    // if (this.grab) {
    //
    // } else {
    //
    // }
  }

  onMouseUp(event) {
    // console.log('up');

    var target = event.target;
    var point = Mouse.getPosition(event);

    if (this.grab) {

    } else {
      if (event.target !== this.el) {
        let index = event.target.dataset.index;
        if (index !== undefined) {
          this.emit('select', { index: index-1 });
        }
      }
    }

    this.endMouseCapture();
    this.grab = false;
  }

  onMouseMove(event) {
    var point = Mouse.getPosition(event);

    if (this.grab) {
      this.el.scrollLeft -= event.movementX;
    } else {
      if (Mouse.isLeftButtonDown(event)) {
        this.dragAmount += event.movementX;
        if (Math.abs(this.dragAmount) > 3) {
          this.grab = true;
        }
      }
    }
  }

  onWheel(event) {
    let deltaX = event.deltaX;
    if (Math.abs(deltaX) > Math.abs(this.velocity)) this.velocity = deltaX;
    if (this.timerId == null) {
      this.acceleration = 1;
      this.timerId = setInterval(() => {
        this.velocity = this.velocity * this.acceleration;
        this.el.scrollLeft += this.velocity;
        this.acceleration *= 0.5;
        if (this.acceleration < 0.1) {
          clearInterval(this.timerId);
          this.velocity = 0;
          this.timerId = null;
        }
      }, 1000/60);
    }
  }

  handleEvent(event) {
    if (event.type == 'mousedown') {
      this.onMouseDown(event);
    }
    else if (event.type == 'mouseup') {
      this.onMouseUp(event);
    }
    else if (event.type == 'mousemove') {
      this.onMouseMove(event);
    }
    else if (event.type == 'resize') {
      // this.onResize(event);
    }
    else if (event.type == 'wheel') {
      this.onWheel(event);
    }
    else if (event.type == 'blur') {
      this.onBlur(event);
    }
  }
}

module.exports = FrameList;
