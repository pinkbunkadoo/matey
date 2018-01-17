
class ColorPreset {
  static get BLACK() { return new Color() }
  static get GRAY() { return new Color(128, 128, 128) }
  static get WHITE() { return new Color(255, 255, 255) }
  static get RED() { return new Color(255, 0, 0) }
  static get GREEN() { return Color(0, 255, 0) }
  static get BLUE() { return new Color(0, 0, 255) }
}

module.exports = ColorPreset;
