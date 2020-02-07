const api = "https://api.spotify.com/v1/search?q=";

/*const tracklist = `${search}&type=track`; 
Client ID aafde63513c44f8c9f558c75a05a6612
Client Secret ad4b9a6c8e6943179a2f6499727cc123*/


const hash = window.location.hash
.substring(1)
.split('&')
.reduce(function (initial, item) {
  if (item) {
    var parts = item.split('=');
    initial[parts[0]] = decodeURIComponent(parts[1]);
  }
  return initial;
}, {});
window.location.hash = '';

// Set token
let _token = hash.access_token;

const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'aafde63513c44f8c9f558c75a05a6612';
const redirectUri = 'http://127.0.0.1:5500/index.html';
const scopes = [
  'user-top-read', 'user-read-currently-playing',
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Make a call using the token
$.ajax({
   url: "https://api.spotify.com/v1/me/player/currently-playing",
   type: "GET",
   beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
   success: function(data) {
       let songName=data.item.name;
       let artistName=data.item.artists[0].name;
       console.log(songName);
       console.log(artistName);
       $(`<li>${songName} - ${artistName}</li>`).appendTo('.search-results')
     // Do something with the returned data
   }
});



$('.search-btn').on('click', e => {
    e.preventDefault();
    let song = $('.search-box').val();
    $('.search-results').html(`<ul>
        <li>Look what you did!</li>
        <li>${song}</li>
        <li>
        </ul>`);

});