
class PaperActionType {
  static get INITIAL() { return this.name + '.INITIAL' }
  static get NEW_STROKE() { return this.name + '.NEW_STROKE' }
  static get DELETE_STROKE() { return this.name + '.DELETE_STROKE' }
  static get STROKE_ORDER() { return this.name + '.STROKE_ORDER' };
  static get MOVE() { return this.name + '.MOVE' };
}

module.exports = PaperActionType;
