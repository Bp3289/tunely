//Client side



var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });



//when the doc loads run all these function
$(document).ready(function() {
    
   

  var eachAlbumsSongs = []; // array that the songs will go into
 
  var songsVar = "";
  
  $.get('/api/albums', function(albums){
    

    albums.forEach(function(eachAlbum, index){
      renderAlbum(eachAlbum);
      buildSongsHtml(eachAlbum.songs);
    });
    
  });
 
 
  //grab the form data and serialize it
  
 $('#singlebutton').on("click", function(e){
    e.preventDefault();
    var serialData = $("#album-form").find("select,textarea, input").serialize();
    console.log("serialData: " + serialData);
    var inputFields = $("#album-form").find("select,textarea, input");
    


    
  
    $.ajax({
      url: 'http://localhost:3000/api/albums',
      type: 'POST',
      data: serialData 
      
    })
    .done(function(){
    
        $.get('/api/albums', function(res){
          res.forEach(function(thisAlbum){
            renderAlbum(thisAlbum);
           
          });
        });
        
    });

  }); //Submit button 
$('#albums').on('click', '.add-song', function(e) {
    var id= $(this).parents('.album').data('album-id');
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });

  $('#saveSong').on('click', handleNewSongSubmit);

});

$('#songModal').modal();






// adds new song 
function handleNewSongSubmit(e) {
  var albumId = $('#songModal').data('album-id');
  var songName = $('#songName').val();
  var trackNumber = $('#trackNumber').val();

  var updateTrack = {
    name: songName,
    trackNumber: trackNumber
  };

  var stringForPost = '/api/albums/' + albumId + '/songs';
  

  $.post(stringForPost, updateTrack)
    .success(function(song) {
      // re-get full album and render on page
      $.get('/api/albums/' + albumId).success(function(album) {
        //remove the old album so there arent 2 on the page
        $('[data-album-id='+ albumId + ']').remove();
        renderAlbum(album);
      });

//this clears the tracknumber text input
      $('#trackNumber').val('');

//this clears the songname text input with an empty string
      
      $('#songName').val('');

      $('#songModal').modal('hide');

    });
}


  var buildSongsHtml = function(songs) {
  var eachSong = " -- ";

  songs.forEach(function(song) {

    eachSong = eachSong + "(" + song.trackNumber + ") " + song.name + " -- ";
  });
  var songsHtml  =
   "<li class='list-group-item'>" +
   "<h4 class='inline-header'>Songs:</h4>" +
   "<span>" + eachSong + "</span>" +
   "</li>";
  return songsHtml;
};

// this function takes a single album and renders it to the page
function renderAlbum(album) {
 

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-name'>" + album.releaseDate + "</span>" +
  "                      </li>" +

                                buildSongsHtml(album.songs) +


  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";
 
  
  //grab #albums id and add albumHtml to it
  $('#albums').append(albumHtml);


}