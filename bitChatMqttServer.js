// Lets require/import the HTTP module
var mosca = require('mosca');
var redis = require('redis');
var utils = require('./utils');
var redisClient = redis.createClient(); //creates a new client
var ip = require("ip");

//protobuf related, got to move this to another fragment_user_profile
var protobuf = require('protobufjs');
var jsonDescriptor = require('./location.json');
var root = protobuf.Root.fromJSON(jsonDescriptor);
var locationMessage = root.lookup('ro.cluj.totemz.UserLocation');

//Lets define a port we want to listen to
const HOST = ip.address();
const PORT = 4000;

/*possible topics the broker receives messages from*/


var topic = {
  user: '/user/',
  friend: '/friend/'
};

var pubsubsettings = {
  type: 'mqtt',
  json: false,
  mqtt: require('mqtt'),
  host: HOST,
  port: PORT
};

var server = new mosca.Server(pubsubsettings);

redisClient.on('connect', function() {
  console.log('Redis connected');
});

// fired when a message is received
server.on('published', function(packet, client) {
  if (topic.user === packet.topic) {
    if (utils.checkIfDefined(packet.payload.toString())) {
      console.log('Topic', packet.topic);
      console.log('Published', packet.payload.toString());
      var msg = packet.payload.toString();
      var msgArray = msg.split(':');
      redisClient.set(msgArray[0], msg,
        function(err, reply) {
          console.log("Redis stored key: ", reply);
        });
      // var message = locationMessage.decode(packet.payload);
      // protobuf.load("location.proto", function(err, root) {
      //   if (err) throw err;
      //
      //   // Obtain a message type
      //   var locationMsg = root.lookup("ro.cluj.totemz.UserLocation");
      //
      //   // Decode an Uint8Array (browser) or Buffer (node) to a message
      //   var message = UserLocation.decode(packet.payload);
      //   // ... do something with message
      //   console.log(message);
      //   // If your application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
      // });

    }
  }
});

server.on('subscribed', function(topic, client) {
  console.log("Topic :=", topic);
});

// fired when a client connects
server.on('clientConnected', function(client) {
  console.log('Client Connected:', client.id);
});
// fired when a client disconnects
server.on('clientDisconnected', function(client) {
  console.log('Client Disconnected:', client.id);
  redisClient.del(client.id);
});

server.on('ready', setup);

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running');
  console.log('Publish friends location interval started');
  setInterval(function() {
    redisClient.keys('*', function(err, keys) {
      if (err) return console.log(err);
      for (var i = 0, len = keys.length; i < len; i++) {
        //redisClient.del(keys[i]);
        redisClient.get(keys[i], function(err, msg) {
          var message = {
            topic: topic.friend,
            payload: msg, // or a Buffer
            qos: 0, // 0, 1, or 2
            retain: false // or true
          };
          server.publish(message, function() {
            console.log('Sent:', message);
          });
        });
      }
    });
  }, 10000);
}
