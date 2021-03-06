const Container = require('../../container');
const Checkbox = require('../../checkbox');
const ToolButton = require('../../tool_button');
const Label = require('../../label');
const Spacer = require('../../spacer');
const Color = require('../../../color');
const ColorSwatch = require('../../color_swatch');

function StrokeProperties(params) {
  params = params || {};
  // params.style = params.style || {};
  // params.style.padding = '8px';
  // params.style.flexDirection = 'column';

  Container.call(this, params);

  this.addClass('stroke-properties');

  this.heading = new Label({ title: 'Properties' });
  this.add(this.heading);

  this.add(new Spacer({ width: 8, height: 8 }));

  this.colorContainer = new Container({ style: { flexDirection: 'row', alignItems: 'center' }});

  var label = new Label({ title: 'Stroke:' });
  this.colorContainer.add(label);

  this.colorContainer.add(new Spacer({ width: 8, height: 8 }));

  this.strokeColor = new ColorSwatch({ tag: 'properties.stroke.color', color: Color.White });
  this.colorContainer.add(this.strokeColor);

  this.colorContainer.add(new Spacer({ width: 8, height: 8 }));

  var label = new Label({ title: 'Fill:' });
  this.colorContainer.add(label);

  this.colorContainer.add(new Spacer({ width: 8, height: 8 }));

  this.fillColor = new ColorSwatch({ tag: 'properties.stroke.fill', color: Color.White });
  this.colorContainer.add(this.fillColor);

  this.add(this.colorContainer);

  // this.fillContainer = new Container({ style: { flexDirection: 'row', alignItems: 'center' }});
  // this.fillCheckbox = new Checkbox({ width: 24, height: 24, onChange: this.onFillChange.bind(this) });
  // this.fillCheckbox = new ToolButton({ image: 'tick', width: 24, height: 24 });

  // this.fillContainer.add(this.fillCheckbox);
  // this.add(this.fillContainer);
  // this.onChange = params.onChange;
}

StrokeProperties.prototype = Object.create(Container.prototype);
StrokeProperties.prototype.constructor = StrokeProperties;

StrokeProperties.prototype.onFillChange = function(params) {
  // console.log('onFillChange', params.item, params.item.state);
  // if (this.onChange) this.onChange(this);
  this.emit('fill-change', { fill: params.item.state });
}

StrokeProperties.prototype.getFill = function() {
  // return this.fillCheckbox.state;
}

StrokeProperties.prototype.update = function(params) {
  // this.fill = params.fill;
  // this.fillCheckbox.setState(this.fill);
}

StrokeProperties.prototype.render = function(params) {
  if (params.cmd === 'show') {
    // this.fill = params.object.fill;
    // this.fillCheckbox.setState(this.fill);
  }
}

module.exports = StrokeProperties;
