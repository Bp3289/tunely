// SERVER-SIDE JAVASCRIPT


var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

var db = require('./models');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());





app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


//JSon endpoints

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
    
    db.Album.find({}, function(err, albums){
      //has to be lowercase
      res.json(albums);
    });
    
});



app.post('/api/albums', function album_post(req,res){

  var createAlbum = new db.Album({
              artistName: req.body.artistName,
              name: req.body.name,
              releaseDate: req.body.releaseDate,
              genres: [req.body.genres]
  });
 
  createAlbum.save(function(err, album){
    res.json(req.body.name+" was added");
  });
});

app.get('/api/albums/:id', function albumShow(req,res){
  //go to the db and find the album with id form the url
  db.Album.findOne({_id: req.params.id}, function(err, album){
    //respond with json
    res.json(album);
  });
});

app.post('/api/albums/:albumId/songs', function songCreate(req, res) {
  //go to db find one album with id from url string {_id: req.params.albumId} 
  db.Album.findOne({_id: req.params.albumId}, function(err, album) {
    if (err) { console.log('error album+songs post route:' + err); }
/// model for making new song
    var song = new db.Song(req.body);
    /// push the song into the album's songs array
    album.songs.push(song);
    //save the album into the db
    album.save(function(err, savedAlbum) {
      if (err) { console.log('error', err); }
      console.log('album with new song saved:', savedAlbum);
      res.json(song);
    });
  });

});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});