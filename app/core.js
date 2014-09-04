var eyevinnPlayer = angular.module('eyevinnplayer', []);
var url = require('url');
var request = require('request');

var player;
var apithrottle = 'http://localhost:5000/api/throttler';
var apistream = 'http://localhost:5000/api/stream';

function mainController($scope, $http) {
  $scope.formPlayer = {};
  
  $http.get(apistream)
    .success(function(data) {
      $scope.formPlayer.stream = data.stream;
    })
    .error(function(data) {
      console.log("Error: " + data);
    });
    
  $scope.loadStream = function() {
    $http.put(apistream, $scope.formPlayer)
      .success(function(data) {
        loadVideo($scope.formPlayer.stream);
      })
      .error(function(data) {
        console.log("Error: " + data);
      });
  };
           
  videojs('video').ready(function() {
    player = this;
    loadVideo($scope.formPlayer.stream);
  });  
}

function loadVideo(stream) {
  var src = url.parse(stream);
  var sdata = { "source": src };
  player.pause();
  request.put(apithrottle, { form: sdata }, function(err, resp, body) {
    var proxy = src;
    proxy.host = "localhost:4000";
    proxy.hostname = "localhost";  
    var proxystream = url.format(proxy);
    console.log(proxystream);
    try {
      player.src([ { type: "application/x-mpegURL", src: proxystream } ]);
      player.play();
    } catch (err) {
      console.log("Error: " + err);
    }
  });    
}

function getSpeed(callback) {
  var speed;
  request(apithrottle, function(err, resp, body) {
    var data = JSON.parse(body);
    speed = data.speed;
    callback(speed);
  });
}

function setSpeed(speed) {
  var request = require('request');
  var tdata = { "speed": speed };
  request.put(apithrottle, { form: tdata }, function(err, resp, body) {
    var data = JSON.parse(body);
  });
}