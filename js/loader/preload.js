var preload = {};

preload.LoadItem = function(filename, id) {
  this.id = id;
  this.filename = filename;

}


preload.Loader = function(item) {
  this.item = item;
  this.xhr = new XMLHttpRequest();
  this.xhr.addEventListener("load", this);
  this.xhr.open("GET", item.filename, true);
  this.xhr.responseType = "blob";
  this.xhr.send();
}

preload.Loader.prototype.handleEvent = function(event) {
  if (event.type == "load") {
    this.onLoad(event);
  }
}

preload.Loader.prototype.onLoad = function(event) {
  var xhr = event.target;
  if (xhr.readyState == XMLHttpRequest.DONE && xhr.status === 200) {
    this.item;
    // this.content = xhr.response;
    // this.loader.onItemLoad(this);
  }
}

preload.Loader.prototype.addListener = function(type, callback) {
  this.listeners.push({ type: type, callback: callback });
}

// preload.Loader.prototype.onItemLoad = function(item) {
//   for (var i = 0; i < this.listeners.length; i++) {
//     var listener = this.listeners[i];
//     if (listener.type == "load") {
//       listener.callback({ target: item });
//     }
//   }
// }

preload.Queue = function() {
  this.numitems = 0;
}

preload.Queue.prototype.addFile = function(filename, id) {
  var item = new preload.LoadItem(filename, id);
  var loader = new preload.Loader(item);
  this.numitems = this.numitems + 1;
}

preload.Queue.prototype.addListener = function(type, callback) {
  this.listeners.push({ type: type, callback: callback });
}

