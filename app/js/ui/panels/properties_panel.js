const List = require('../list');
const ListItem = require('../list_item');
const Panel = require('../panel');
const Spacer = require('../spacer');
const StrokeProperties = require('./properties/stroke_properties');
const Stroke = require('../../display/stroke');

function PropertiesPanel(params) {
  params = params || {};
  params.title = 'Properties';
  Panel.call(this, params);

  var self = this;

  // this.panes = [];
  // this.panes.stroke = new StrokeProperties();
  // this.panes.stroke.bind('fill-change', function(params) {
  //   // console.log('fill-change', params.fill);
  //   self.emit('stroke-fill-change', params);
  // });
}

PropertiesPanel.prototype = Object.create(Panel.prototype);
PropertiesPanel.prototype.constructor = PropertiesPanel;

PropertiesPanel.prototype.render = function(params) {
  // if (params.cmd === 'show') {
  //   if (params.object instanceof Stroke) {
  //     this.panes.stroke.render({ cmd: 'show', fill: params.object.fill });
  //     this.setPane(this.panes.stroke);
  //   }
  // }
  // else if (params.cmd === 'clear') {
  //   this.setPane();
  // }
}

module.exports = PropertiesPanel;
