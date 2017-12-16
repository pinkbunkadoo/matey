const EventEmitter = require('events').EventEmitter;
const Container = require('../container');
const ToolButton = require('../tool_button');
const Color = require('../../color');
const ColorSwatch = require('../color_swatch');
const Spacer = require('../spacer');
const Divider = require('../divider');
// const PointerTool = require('../../tools/pointer_tool');
// const PencilTool = require('../../tools/pencil_tool');


class ToolsPalette extends Container {
  constructor(el) {
    super(el);

    // this.el = el;

    this.buttons = [];
    this.buttons['pointer'] = new ToolButton(this.el.querySelector('#tools-pointer'));
    this.buttons['pencil'] = new ToolButton(this.el.querySelector('#tools-pencil'));
    this.buttons['line'] = new ToolButton(this.el.querySelector('#tools-line'));
    this.buttons['polygon'] = new ToolButton(this.el.querySelector('#tools-polygon'));
    this.buttons['hand'] = new ToolButton(this.el.querySelector('#tools-hand'));
    this.buttons['zoom'] = new ToolButton(this.el.querySelector('#tools-zoom'));

    this.tools = null;

    this.buttons['pointer'].on('pressed', () => { this.onToolSelect('pointer'); });
    this.buttons['pencil'].on('pressed', () => { this.onToolSelect('pencil'); });
    this.buttons['line'].on('pressed', () => { this.onToolSelect('line'); });
    this.buttons['polygon'].on('pressed', () => { this.onToolSelect('polygon'); });
    this.buttons['hand'].on('pressed', () => { this.onToolSelect('hand'); });
    this.buttons['zoom'].on('pressed', () => { this.onToolSelect('zoom'); });

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = '4em';
      this.buttons[name].el.style.height = '3em';
    }

    this.colorSwatch = new ColorSwatch(this.el.querySelector('#tools-color'));
    this.fillSwatch = new ColorSwatch(this.el.querySelector('#tools-fill'));

    // var colorContainer = new Container({ style: { justifyContent: 'center' }});
    //
    // this.strokeColor = new ColorSwatch({ tag: 'stroke_color', color: Color.Black });
    // colorContainer.add(this.strokeColor);
    // this.strokeColor.on('color-change', (color) => {
    //   // self.emit()
    // });
    //
    // colorContainer.add(new Spacer({ width: 3, height: 2 }));
    //
    // this.fillColor = new ColorSwatch({ tag: 'fill_color', color: Color.White });
    // colorContainer.add(this.fillColor);
    //
    // this.add(colorContainer);
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

  getColor() {
    return this.colorSwatch.getColor();
  }

  getFill() {
    return this.fillSwatch.getColor();
  }
}

module.exports = ToolsPalette;
