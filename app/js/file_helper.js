const Point = require('./geom/point');
const Color = require('./color');
const Stroke = require('./stroke');
const Frame = require('./frame');
const Transform = require('./transform');
const Sequence = require('./sequence');
const Surface = require('./surface');
const Renderer = require('./renderer');
const DisplayList = require('./display_list');
const DisplayItem = require('./display_item');

const fs = require('fs');
const path = require('path');
const GIFEncoder = require('gifencoder');

class FileHelper {

  static exportGIF(filepath, params, callback) {
    let sequence = params.sequence;
    let fps = sequence.fps;
    let width = params.width || 1;
    let height = params.height || 1;
    let thickness = params.thickness || 1.2;
    let scale = params.scale || 1;
    let background = params.background || new Color(255, 255, 255);
    let surface = new Surface({ width: width, height: height })
    let renderer = new Renderer();

    if (sequence instanceof Sequence) {
      let ctx = surface.getContext();
      let transform = new Transform(0, 0, scale);

      const encoder = new GIFEncoder(width, height);
      encoder.createReadStream().pipe(fs.createWriteStream(filepath));
      encoder.start();
      encoder.setRepeat(0);
      encoder.setDelay(1000/fps);

      for (let i = 0; i < sequence.frames.length; i++) {
        let frame = sequence.frames[i];
        renderer.displayList.clear();
        surface.fill(background);

        for (let i = 0; i < frame.strokes.length; i++) {
          let stroke = frame.strokes[i];
          renderer.displayList.add(new DisplayItem({ points: stroke.points, color: stroke.color, fill: stroke.fill, thickness: thickness }));
        }
        renderer.renderToSurface(surface, transform);
        encoder.addFrame(ctx);
      }

      encoder.finish();
    }
  }

  static saveSequence(filepath, sequence, callback) {
    let data = {
      fps: sequence.fps,
      frames: []
    };

    for (let i = 0; i < sequence.frames.length; i++) {
      let frame = sequence.frames[i];
      data.frames[i] = { strokes: [] };

      for (let j = 0; j < frame.strokes.length; j++) {
        let stroke = frame.strokes[j];
        data.frames[i].strokes[j] = { };

        let pointList = [];

        for (let k = 0; k < stroke.points.length; k++) {
          let point = stroke.points[k];
          // first point is stored as absolute, subsequent points are relative
          let x = point.x - (k > 0 ? stroke.points[k-1].x : 0);
          let y = point.y - (k > 0 ? stroke.points[k-1].y : 0);
          pointList.push(x.toFixed(3), y.toFixed(3));
        }
        data.frames[i].strokes[j].points = pointList.toString();
        // colors are stored as CSS hex values
        data.frames[i].strokes[j].fill = stroke.fill ? stroke.fill.toHexString() : null;
        data.frames[i].strokes[j].color = stroke.color ? stroke.color.toHexString() : null;
      }
    }

    let output = JSON.stringify(data, null, 2);

    fs.writeFile(filepath, output, (err) => {
      if (err) throw err;
      if (callback) callback();
    });
  }

  static loadSequenceFromFile(filepath, callback) {
    fs.readFile(filepath, 'utf8', function(err, data) {
      if (err) throw err;

      let obj = JSON.parse(data);

      let sequence = new Sequence({ fps: obj.fps || undefined });

      if (obj.frames instanceof Array) {
        for (let i = 0; i < obj.frames.length; i++) {
          let _frame = obj.frames[i];
          let strokes = [];

          for (let j = 0; j < _frame.strokes.length; j++) {
            let _stroke = _frame.strokes[j];
            let _points = _stroke.points.split(',');
            let points = [];

            for (let k = 0, x = 0, y = 0; k < _points.length; k = k + 2) {
              x += parseFloat(_points[k]);
              y += parseFloat(_points[k+1]);
              points.push(new Point(x, y));
            }

            strokes.push(new Stroke({
              points: points,
              color: _stroke.color ? Color.fromHexString(_stroke.color) : null,
              fill: _stroke.fill ? Color.fromHexString(_stroke.fill) : null
            }));
          }

          sequence.add(new Frame(strokes));
        }
      }

      if (callback) callback(sequence);
    });
  }

}

module.exports = FileHelper;
