const EventEmitter = require('events').EventEmitter;
const Const = require('../../const');
const Container = require('../container');
const Panel = require('../panel');
const ToolButton = require('../tool_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');

class Tools extends Panel {
  constructor(params={}) {
    params.el = document.getElementById('tools');
    super(params);

    this.buttons = [];
    this.buttons['pointer'] = new ToolButton({ el: document.getElementById('tools-pointer'), name: 'pointer' });
    this.buttons['pencil'] = new ToolButton({ el: document.getElementById('tools-pencil'), name: 'pencil' });
    this.buttons['line'] = new ToolButton({ el: document.getElementById('tools-line'), name: 'line' });
    this.buttons['polygon'] = new ToolButton({ el: document.getElementById('tools-polygon'), name: 'polygon' });
    this.buttons['hand'] = new ToolButton({ el: document.getElementById('tools-hand'), name: 'hand' });
    this.buttons['zoom'] = new ToolButton({ el: document.getElementById('tools-zoom'), name: 'zoom' });
    this.tools = null;

    this.buttons['pointer'].on('pressed', () => { this.onToolSelect('pointer'); });
    this.buttons['pencil'].on('pressed', () => { this.onToolSelect('pencil'); });
    this.buttons['line'].on('pressed', () => { this.onToolSelect('line'); });
    this.buttons['polygon'].on('pressed', () => { this.onToolSelect('polygon'); });
    this.buttons['hand'].on('pressed', () => { this.onToolSelect('hand'); });
    this.buttons['zoom'].on('pressed', () => { this.onToolSelect('zoom'); });

    // this.colorsContainer = new Container({ el: document.getElementById('tools-colors'), name: 'colors' });
    // this.colorSwatch = new ColorSwatch({ el: document.getElementById('tools-color'), name: 'color', color: app.colors.STROKE });
    // this.fillSwatch = new ColorSwatch({ el: document.getElementById('tools-fill'), name: 'fill', color: null });
    // this.colorsContainer.add(this.colorSwatch);
    // this.colorsContainer.add(this.fillSwatch);
  }

  onToolSelect(name) {
    this.setTool(name);
    this.emit('tool-change', { tool: name });
  }

  setTool(name) {
    if (this.tool) {
      this.buttons[this.tool].setState(false);
    }
    this.tool = name;
    this.buttons[this.tool].setState(true);
  }

}

module.exports = Tools;
