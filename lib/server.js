var express = require('express');
var app = express();
var throttler = require('./throttler');

var port = 5000;
var router = express.Router();
router.get('/', function(req, res) {
  res.json({ message: 'This is the Eyevinn throttler API' });
});

router.route('/throttler')
  .put(function(req, res) {
    //var settings = JSON.parse(req.body);
    //var speed = settings['speed'];
    //throttler.setSpeed(speed);
    throttler.setSpeed(900);
    res.json({ message: 'New speed set' });
  });
app.use('/api', router);
app.listen(port);
console.log("Started API server");
