
function Emitter() {
  this.listeners = [];
}

Emitter.prototype.constructor = Emitter;

Emitter.prototype.emit = function(event, params) {
  this.listeners.forEach(function(currentValue) {
    if (currentValue.event === event) {
      currentValue.handler(params);
    }
  });
  for (var i = 0; i < this.listeners.length; i++) {
    var listener = this.listeners[i];
  }
}

Emitter.prototype.bind = function(event, handler) {
  this.listeners.push({ event: event, handler: handler });
}

module.exports = Emitter;