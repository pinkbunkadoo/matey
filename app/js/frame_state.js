
class FrameState {
  constructor(params) {
    this.strokes = [];
    if (params.strokes instanceof Array) {
      for (var i = 0; i < params.strokes.length; i++) {
        this.strokes.push(params.strokes[i].copy());
      }
    }
  }
}

module.exports = FrameState;
