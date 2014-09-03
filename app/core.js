var eyevinnPlayer = angular.module('eyevinnplayer', []);

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
  try {
    player.pause();
    player.src([ { type: "application/x-mpegURL", src: stream } ]);
    player.play();
  } catch (err) {
    console.log("Error: " + err);
  }
}

function getSpeed(callback) {
  var request = require('request');
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