
function Loader() {
}

Loader.load = function(url, callback) {
  var ajax = new XMLHttpRequest();
  ajax.open("GET", url, true);
  ajax.send();
  ajax.onload = callback;
}

module.exports = Loader;
