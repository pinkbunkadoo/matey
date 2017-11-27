const Base = require('./base');
const Container = require('./container');
const Spacer = require('./spacer');
const Label = require('./label');
const Icon = require('./icon');
const ToolButton = require('./tool_button');

function Checkbox(params) {
  params = params || {};
  Container.call(this, params);

  this.addClass('checkbox');

  this.state = false;
  this.onChange = params.onChange;

  this.box = new Container();
  this.box.addClass('checkbox-box');

  this.tickIcon = new Icon({ resource: 'tick', width: app.icons['tick'].width, height: app.icons['tick'].height });
  this.box.add(this.tickIcon);

  this.add(this.box);
  this.add(new Spacer({ width: 4 }));
  this.add(new Label({ title: 'Fill' }));

  this.el.onclick = this.onClick.bind(this);
}

Checkbox.prototype = Object.create(Container.prototype);
Checkbox.prototype.constructor = Checkbox;

Checkbox.prototype.setState = function(state) {
  if (state) {
    if (!this.state) this.addClass('selected');
    // console.log(this.el.className);
    // this.tickIcon.el.style.display = 'block';
    this.tickIcon.el.style.opacity = 1;
  } else {
    if (this.state) this.removeClass('selected');
    this.tickIcon.el.style.opacity = 0;
    // this.tickIcon.el.style.display = 'none';
  }
  this.state = state;
}

Checkbox.prototype.onClick = function(event) {
  this.setState(!this.state);
  if (this.onChange) this.onChange({ item: this });
}

module.exports = Checkbox;
