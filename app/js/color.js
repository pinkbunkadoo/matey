
function Color(r, g, b, a) {
  this.r = r;
  this.g = g;
  this.b = b;
  this.a = a;
}

Color.prototype.constructor = Color;

Color.fromHexString = function(text) {
  var s = text.trim();
  var r = 0, g = 0, b = 0, a = 255;

  if (s[0] === '#') {
    s = s.substring(1);
    if (s.length === 3) {
      r = parseInt(s[0]), g = parseInt(s[1]), b = parseInt(s[2]);
    } else if (s.length == 4) {
      r = parseInt(s[0]), g = parseInt(s[1]), b = parseInt(s[2]), a = parseInt(s[3]);
    } else if (s.length == 6) {
      r = parseInt(s[0] + s[1]), g = parseInt(s[2] + s[3]), b = parseInt(s[4] + s[5]);
    } else if (s.length == 8) {
      r = parseInt(s[0] + s[1]), g = parseInt(s[2] + s[3]), b = parseInt(s[4] + s[5]), a = parseInt(s[6] + s[7]);
    }
  }

  return new Color(r, g, b, a);
}

Color.prototype.toHexString = function() {
  var r = this.r, g = this.g, b = this.b, a = this.a;
  r = (r > 0xf ? r.toString(16) : '0' + r.toString(16));
  g = (g > 0xf ? g.toString(16) : '0' + g.toString(16));
  b = (b > 0xf ? b.toString(16) : '0' + b.toString(16));
  a = (a > 0xf ? a.toString(16) : '0' + a.toString(16));
  return '#' + r + g + b + a;
}

module.exports = Color;