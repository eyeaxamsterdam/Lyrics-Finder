/* const api = "https://api.spotify.com/v1/search?q="; */

/*const tracklist = `${search}&type=track`; 
Client ID aafde63513c44f8c9f558c75a05a6612
Client Secret ad4b9a6c8e6943179a2f6499727cc123*/


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
                $(`<p class="selection selection-number${[i+1]}" id="${songid}"><span class="song-name">${songName}</span> - <span class="artist-name">${artistName}</span></p>`).appendTo('.search-results');
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
                    fetch(`https://orion.apiseeds.com/api/music/lyric/${artistName}/${songName}?apikey=IMhMN29mkSHK4OfQsxWIUwylijoGFLTduAvZZH5uQR2IAfMVmsbTuXwhdyBuPmch`)
                    .then((response) => {
                        return response.json();
                      })
                      .then((myJson) => {
                          console.log(myJson.result.track.text);
                          $('.lyrics').html(`${myJson.result.track.text}`);
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