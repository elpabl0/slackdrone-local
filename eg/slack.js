'use strict';

var app = require('express')();
var Slack = require('slack-node');
var Drone = require('../');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ACTIVE = false;
var STEPS = 2;


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    var actioned = "Unknown Command";
    s.setWebhook("https://hooks.slack.com/services/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");
    if (ACTIVE && msg) {
      if (msg == "dronebot launch") {
      var actioned = "Dronebot Launched!";
      d.takeOff();
      slackreport(actioned);
    } else if (msg == "dronebot land") {
      var actioned = "Initiated Landing Sequence...";
      d.land();
      slackreport(actioned);
    } else if (msg == "dronebot kill") {
      var actioned = "Emergency Shutdown";
      d.emergency();
      setTimeout(function () {
        process.exit();
      }, 3000);
      slackreport(actioned);
    } else if (msg == "dronebot forward") {
      var actioned = "I'm flying forward";
      d.forward({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot backward") {
      var actioned = "I'm flying backward";
      d.backward({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot turn left") {
      var actioned = "I'm turning left";
      d.turnLeft({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot fly left") {
      var actioned = "I'm flying left";
      d.tiltLeft({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot fly right") {
      var actioned = "I'm flying right";
      d.tiltRight({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot turn right") {
      var actioned = "I'm turning right";
      d.turnRight({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot up") {
      var actioned = "I'm flying up";
      d.up({ steps: STEPS * 2.5 });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot down") {
      var actioned = "I'm flying down";
      d.down({ steps: STEPS * 2.5 });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot front flip") {
      var actioned = "I'm flipping forward";
      d.frontFlip({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot left flip") {
      var actioned = "I'm flipping left";
      d.leftFlip({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot right flip") {
      var actioned = "I'm flipping right";
      d.rightFlip({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    } else if (msg == "dronebot back flip") {
      var actioned = "I'm flipping backwards";
      d.backFlip({ steps: STEPS });
      cooldown();
      slackreport(actioned);
    }
  }
  console.log(actioned);
  });
});



//process.stdin.setRawMode(true);
//process.stdin.resume();

if (process.env.UUID) {
  console.log('Searching for ', process.env.UUID);
}

var d = new Drone(process.env.UUID);
var s = new Slack();


d.connect(function () {
  d.setup(function () {
    console.log('Configured for Rolling Spider! ', d.name);
    d.flatTrim();
    d.startPing();
    d.flatTrim();

    // d.on('battery', function () {
    //   console.log('Battery: ' + d.status.battery + '%');
    //   d.signalStrength(function (err, val) {
    //     console.log('Signal: ' + val + 'dBm');
    //   });

    // });

    // d.on('stateChange', function () {
    //   console.log(d.status.flying ? "-- flying" : "-- down");
    // })
    setTimeout(function () {
      console.log('ready for flight');
      ACTIVE = true;
    }, 1000);

  });
});

function cooldown() {
  ACTIVE = false;
  setTimeout(function () {
    ACTIVE = true;
  }, STEPS * 12);
}

function slackreport(actioned) {
  s.webhook({
  channel: "#hacktesting",
  username: "dronebot",
  text: actioned
}, function(err, response) {
  console.log(response);
});
}

http.listen(4000, function(){
  console.log('listening on *:4000');
});


//launch();


// webhookUri = "https://hooks.slack.com/services/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";
