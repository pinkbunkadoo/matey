const Panel = require('../panel');
const Container = require('../container');

function PencilOptions(params) {
  params = params || {};
  Panel.call(this, params);

  this.addClass('pencil-options');
}

PencilOptions.prototype = Object.create(Panel.prototype);
PencilOptions.prototype.constructor = PencilOptions;

PencilOptions.prototype.render = function(params) {

}

module.exports = PencilOptions;
