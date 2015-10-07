

function initialize() {

  //Setup Google Map
  var myLatlng = new google.maps.LatLng(23.989052, 78.660293);
  var light_grey_style = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];
  var myOptions = {
    zoom: 4,
    center: myLatlng,
    mapTypeId: google.maps.MapTypeId.HYBRID,
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.LEFT_BOTTOM
    },
    styles: light_grey_style
  };
  var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  //Setup heat map and link to Twitter array we will append data to
  var heatmap;
  var liveTweets = new google.maps.MVCArray();
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: liveTweets,
    radius: 20
  });
  heatmap.setMap(map);







  if(io !== undefined) {
    // Storage for WebSocket connections
    var socket = io.connect('/');

    // This code listens on the "twitter-steam" channel and data is 
    // received everytime a new tweet is receieved.
    socket.on('twitter-stream', function (data) {

      console.log(data); 
      var score = data.result.score;
      var score1 = 100000000 ;
      //if(!score) score1 = 0;
      //if(score>0) score1 = 1000;
      //if(score<0) score1 = 100000000;
  
  // PROBLEM IS TO MAKE HEAT MAP OF SCORE NOT DENSITY 
      //Add tweet to the heat map array.
      var tweetLocation =   {location: new google.maps.LatLng(data.lng,data.lat),weight: score1 }; 
      var tweetl = new google.maps.LatLng(data.lng,data.lat);
      liveTweets.push(tweetLocation);

      //Flash a dot onto the map quickly
if(score<0)
      var image = "css/reddot.png";
else var image = "css/greendot.png";

      var marker = new google.maps.Marker({
        position: tweetl,
        map: map,
        icon: image
      });
      setTimeout(function(){
        marker.setMap(null);
      },60000000);

           var infoWindowText = '<div id="content">' + 
                                 '<div id="bodyContent">' + 
                                 '<img src=' +  "../css/favicon.ico" + ' />' +'@'+ data.name + '<strong> Score: '+ score + '</strong>' +'</br>' + 
                                  data.text +  '<div>' + data.created_at + '</div>'+ 
               
                                 '</div>' + 
                                 '</div>';
            
            var infowindow = new google.maps.InfoWindow({
                     content: infoWindowText,
                     maxWidth: 200
            });

if(score>0) var image2 = "css/3.gif"; else if (score!=0) var image2 = "css/6.gif"; else var image2 = "css/1.gif";


            var markerr = new google.maps.Marker({
                            position: tweetl,
                            map: map,
                            icon: image2,
                            title: '@' + data.name,
                            animation: google.maps.Animation.BOUNCE
            });

        setTimeout(function(){
        markerr.setMap(null);
      },60000000);
            
            google.maps.event.addListener(markerr, 'click', function() {
                    infowindow.open(map,markerr);
            });
            






    });




    // Listens for a success response from the server to 
    // say the connection was successful.
    socket.on("connected", function(r) {

      //Now that we are connected to the server let's tell 
      //the server we are ready to start receiving tweets.
      socket.emit("start tweets");
    });
  }
}
