/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
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
/* end of hard-coded data */




$(document).ready(function() {
  console.log('app.js loaded!');
   $.get('/api/albums', function(albums) {
        albums.forEach(function(album){
        renderAlbum(album);
       });
      $('#albums').on('click', '.add-song', function(e) {
      e.preventDefault();
      var id = $(this).parents('.album').data('album-id');
      console.log('id', id);
      $('#songModal').data('album-id', id);
      $('#songModal').modal();
    });


$("form").on("submit", function(e){
        e.preventDefault();
        console.log($(this).serialize() );
        $.post("/api/albums", $(this).serialize() );
        $(this).trigger("reset");
      });

$("saveSong").on("click", function makeNewSongSubmit(e){
  e.preventDefault();
  var songName = $("songName").val();
  var trackNumber = parseInt($("#trackNumber").val(), 10);
  var albumId = $("#songModal").data('album-id');
  console.log('testing albumId' + albumId);

var song = {
  name: songName,
  trackNumber: trackNumber
};

console.log(song);
$.ajax({
  url: "/api/albums/" + albumId + "/songs",
  type: 'POST',
  data: song,
  success: [function(data){
    console.log(data);
    $('.album[data-album-id=' + albumId + ']').remove();
  }],
});

 $('#songName').val('');
            $('#trackNumber').val('');
            $('#songModal').modal('toggle');
     });
   });



// $('#album-form').submit(function() {
//     // Get all the forms elements and their values in one step
//     var values = $(this).serialize();
//     console.log(values);

// });

 
function buildSongsHtml(songs) {
  var songText = "  -  ";
  songs.forEach(function(song) {
    songText = songText + "(" + song.trackNumber + ") " + song.name + " &ndash; ";
  });
  var songsHtml  =
   "                      <li class='list-group-item'>" +
   "                        <h4 class='inline-header'>Songs:</h4>" +
   "                         <span>" + songText + "</span>" +
   "                      </li>";
  return songsHtml;
}






// this function takes a single album and renders it to the page
function renderAlbum(album) {

  console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + "HARDCODED ALBUM ID" + "'>" +
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
  "                        <span class='artist-name'>" +  album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate + "</span>" +
  "                      </li>" +
                            buildSongsHtml(album.songs) +

  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" + "<button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery

function reRenderAlbum(id, data) {
  var album = $("div").find("[data-album-id='" + id + "']");
  album.remove();
  renderAlbum(data);
}

//   console.log('album appended');
  $('#albums').append(albumHtml);
}
  });