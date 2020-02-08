/* const api = "https://api.spotify.com/v1/search?q="; */

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
console.log(_token);


const authEndpoint = 'https://accounts.spotify.com/authorize';

// Replace with your app's client ID, redirect URI and desired scopes
const clientId = 'aafde63513c44f8c9f558c75a05a6612';
const redirectUri = 'http://127.0.0.1:5500/index.html';
const scopes = [
    "streaming", "user-read-email", "user-read-private", "user-modify-playback-state"
];

// If there is no token, redirect to Spotify authorization
if (!_token) {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
}

// Make a call using the token
function searchtrack(song) {
    $.ajax({
        url: `https://api.spotify.com/v1/search?q=${song}&type=track`,
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', 'Bearer ' + _token );},
        success: function(data) {
            console.log(data.tracks);
            for (let i=0; i<data.tracks.items.length; i++) {
                let songName=data.tracks.items[i].name;
                let artistName=data.tracks.items[i].artists[0].name;
                let songid=data.tracks.items[i].id;
                console.log(songid, songName, artistName);
                $(`<p class="selection-number${[i+1]}" id="${songid}">${songName} - ${artistName}</p>`).appendTo('.search-results');
                $(`.selection-number${[i+1]}`).click(function() {
                    console.log(this.id);
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me/player/play',
                        type: 'PUT',
                        headers: {
                          'Authorization': `Bearer ${_token}`
                        },
                        device_ids:['519cd79dca85a36d01cc67eac1bd23772d72004e'],
                        dataType: "json",
                        contentType: "application/json",
                        data: JSON.stringify({
                            "uris": [`spotify:track:${this.id}`]
                        })
                    });
                });

            }

        }
    });
}


$('.search-btn').on('click', e => {
    e.preventDefault();
    $('.search-results').empty();
    let song = $('.search-box').val();
    searchtrack(song);
});


/* $('#playpause').on('click', e => {
    e.preventDefault();
    console.log("hello");
    $.ajax({
        url: 'https://api.spotify.com/v1/me/player',
        type: 'PUT',
        headers: {
          'Authorization': `Bearer ${_token}`
        },
        device_ids:['519cd79dca85a36d01cc67eac1bd23772d72004e'],
        dataType: "json",
        contentType: "application/json",
        play: "true"
    });
});
 */