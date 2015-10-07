
/**
 * Module dependencies.
 */

var express = require('express');
var twitter = require('twitter');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io').listen(server);

var app = express();
var twit = new twitter ({
    consumer_key: 'LjTLygs2XFatoVqwopR4MEG52',
    consumer_secret: 'rcpZR5ZfAnhE5G8cctInhagLQYozG2zdp2U0BCyi11txVrGMZh',
    access_token_key: '55184597-HMMfwy8Oq7zLSflOoa6wqhugNAfbufkFcdOpPYV2S',
    access_token_secret: 'xokkZHoPxbJVt4fmAbbGr21PWSC5wsGnSQTEMMUxMqCVn'
}),

stream=null;
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

io.sockets.on('connection', function (socket){
if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {'locations':'-180,-90,180,90'}, function(s) {
          stream = s;
          stream.on('data', function(data) {
              // Does the JSON result have coordinates
              if (data.coordinates){
                if (data.coordinates !== null){
                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1]};

                  socket.broadcast.emit("twitter-stream", outputPoint);

                  //Send out to web sockets channel.
                  socket.emit('twitter-stream', outputPoint);
                }
              }
          });
      });
    }
});
// Emits signal to the client telling them that the
    // they are connected and can start receiving Tweets
    socket.emit("connected");
});


