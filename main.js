var throttler = require('./lib/throttler');
throttler.run();
console.log("Started throttler");

var server = require('./lib/server');

var gui = require('nw.gui');
win = gui.Window.get();
var nativeMenuBar = new gui.Menu({ type: "menubar" });
nativeMenuBar.createMacBuiltin("Eyevinn Player");
win.menu = nativeMenuBar;
win.width = 850;
win.height = 450;
