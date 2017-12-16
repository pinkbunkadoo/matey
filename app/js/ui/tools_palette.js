const EventEmitter = require('events').EventEmitter;
const Container = require('./container');
const ToolButton = require('./tool_button');
const Color = require('../color');
const ColorSwatch = require('./color_swatch');
const Spacer = require('./spacer');
const Divider = require('./divider');
const PointerTool = require('../tools/pointer_tool');
const PencilTool = require('../tools/pencil_tool');


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

    this.buttons['pointer'].onPress = () => { this.onToolSelect('pointer'); };
    this.buttons['pencil'].onPress = () => { this.onToolSelect('pencil'); };
    this.buttons['line'].onPress = () => { this.onToolSelect('line'); };
    this.buttons['polygon'].onPress = () => { this.onToolSelect('polygon'); };
    this.buttons['hand'].onPress = () => { this.onToolSelect('hand'); };
    this.buttons['zoom'].onPress = () => { this.onToolSelect('zoom'); };

    for (let name in this.buttons) {
      this.buttons[name].el.style.width = '32px';
      this.buttons[name].el.style.height = '24px';
    }

    // this.el.style.display = 'block';

    // this.el.style.width = '32px';
    // this.el.style.height = '256px';

    // this.tools['pointer'] = new PointerTool();
    // this.tools['pencil'] = new PencilTool();
    // console.log(this.buttons);

    // this.addClass('tools-palette');

    // var buttonContainer = new Container({ style: { flexDirection: 'column', alignItems: 'center' }});
    //
    // var button = new ToolButton({ tag: 'tools_pointer', image: 'pointer', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('pointer'); };
    // buttonContainer.add(button);
    // this.buttons['pointer'] = button;
    //
    // button = new ToolButton({ tag: 'tools_pen', image: 'pencil', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('pen'); };
    // buttonContainer.add(button);
    // this.buttons['pen'] = button;
    //
    // button = new ToolButton({ tag: 'tools_line', image: 'line', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('line'); };
    // buttonContainer.add(button);
    // this.buttons['line'] = button;
    //
    // button = new ToolButton({ tag: 'tools_polygon', image: 'polygon', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('polygon'); };
    // buttonContainer.add(button);
    // this.buttons['polygon'] = button;
    //
    // button = new ToolButton({ tag: 'tools_zoom', image: 'zoom', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('zoom'); };
    // buttonContainer.add(button);
    // this.buttons['zoom'] = button;
    //
    // button = new ToolButton({ tag: 'tools_hand', image: 'hand', width: 48, height: 36 });
    // button.onPress = () => { this.onToolSelect('hand'); };
    // buttonContainer.add(button);
    // this.buttons['hand'] = button;
    //
    // this.add(buttonContainer);
    //
    // this.add(new Divider({ orientation: 'horizontal', style: { width: '32px' } }))
    //
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
    // console.log(this.tool);
    this.buttons[this.tool].setState(true);
  }

  getStrokeColor() {
    // return this.strokeColor.getColor();
  }

  getFillColor() {
    // return this.fillColor.getColor();
  }
}

module.exports = ToolsPalette;
