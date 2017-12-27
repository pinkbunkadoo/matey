const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');
const Label = require('./label');
const Icon = require('./icon');
const ToolButton = require('./tool_button');

class Checkbox extends Base {
  constructor(params={}) {
    // params.el = params.el || document.createElement('input');
    super(params);

    // this.el.type = 'checkbox';
    this.addClass('checkbox');

    this.el.style.width = (params.width ? params.width * app.unit : 12 * app.unit) + 'px';
    this.el.style.height = (params.height ? params.height * app.unit : 12 * app.unit) + 'px';

    this.state = false;

    this.icon = new Icon({ resource: 'tick' });

    // this.box = new Container();
    // this.box.addClass('checkbox-box');
    //
    // this.tickIcon = new Icon({ resource: 'tick', width: app.icons['tick'].width, height: app.icons['tick'].height });
    // this.box.add(this.tickIcon);
    //
    // this.add(this.box);
    // this.add(new Spacer({ width: 4 }));
    // this.add(new Label({ title: 'Fill' }));
    //

    this.el.addEventListener('click', this);
    this.el.addEventListener('mousedown', this);
  }

  setState(state) {
    if (state != this.state) {
      if (state) {
        if (!this.state) this.addClass('selected');
        this.add(this.icon);
        // this.tickIcon.el.style.opacity = 1;
      } else {
        this.remove(this.icon);
        if (this.state) this.removeClass('selected');
        // this.tickIcon.el.style.opacity = 0;
      }
      this.state = state;
    }
  }

  update() {
    this.removeClass('pressed');
    if (this.state) {
      this.addClass('pressed');
    }
  }

  toggle() {
    this.setState(!this.state);
  }

  update() {

  }

  onClick(event) {
    console.log('onClick');
    this.emit('pressed', this);
  }

  onMouseDown(event) {
    // this.emit('pressed');
    app.capture(this);
  }

  onMouseUp(event) {
    // this.emit('pressed');
    app.release(this);
  }

  handleEvent(event) {
    if (event.type === 'click') {
      this.onClick(event);
    } else if (event.type === 'mousedown') {
      this.onMouseDown(event);
    } else if (event.type === 'mouseup') {
      this.onMouseUp(event);
    }
  }

  // onClick(event) {
  //   this.setState(!this.state);
  //   if (this.onChange) this.onChange({ item: this });
  // }
}

module.exports = Checkbox;
