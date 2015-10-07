//Setup web server and socket
var twitter = require('twitter'),
    express = require('express'),
    sentiment = require('sentiment'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server);

//Setup twitter stream api
var twit = new twitter({
  consumer_key: 'LjTLygs2XFatoVqwopR4MEG52',
    consumer_secret: 'rcpZR5ZfAnhE5G8cctInhagLQYozG2zdp2U0BCyi11txVrGMZh',
    access_token_key: '55184597-HMMfwy8Oq7zLSflOoa6wqhugNAfbufkFcdOpPYV2S',
    access_token_secret: 'xokkZHoPxbJVt4fmAbbGr21PWSC5wsGnSQTEMMUxMqCVn'
}),
stream = null;

//Use the default port (for beanstalk) or default to 8081 locally
server.listen(process.env.PORT || 8081);

//Setup rotuing for app
app.use(express.static(__dirname + '/public'));

//Create web sockets connection.
io.sockets.on('connection', function (socket) {

  socket.on("start tweets", function() {

    if(stream === null) {
      //Connect to twitter stream passing in filter for entire world.
      twit.stream('statuses/filter', {'locations':'-180,-90,180,90','language':'en',track: 'god'}, function(s) {
          stream = s;
          stream.on('data', function(data) {
             var result = sentiment(data.text);
              // Does the JSON result have coordinates
              if (data.coordinates){
                if (data.coordinates !== null){
                  //If so then build up some nice json and send out to web sockets
                  var outputPoint = {"lat": data.coordinates.coordinates[0],"lng": data.coordinates.coordinates[1],"text": data.text,   "profileImage": data.profile_image_url,"created_at": data.created_at,"name":data.user.screen_name,"result":result};

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

