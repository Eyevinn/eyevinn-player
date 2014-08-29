var throttler = require('./lib/throttler');
throttler.run();
console.log("Started throttler");

var server = require('./lib/server');

var gui = require('nw.gui');
console.log(gui.App.getProxyForURL('http://www.google.se'));
