var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var throttler = require('./throttler');

var port = 5000;
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
  res.json({ message: 'This is the Eyevinn throttler API' });
});

router.route('/throttler')
  .put(function(req, res) {
    var speed = req.body.speed;
    if (speed) {
      throttler.setSpeed(speed);
    }
    res.json({ "speed": throttler.getSpeed(), "stream": throttler.getStream() });
  });
  
app.use('/api', router);
app.listen(port);
console.log("Started API server");
