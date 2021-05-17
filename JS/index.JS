"use strict";

//event listener at bottom starts the app
function searchtrack(song) {
  console.log(song)
  fetch(` https://api.happi.dev/v1/music?q=${song}&limit=50&type=&lyrics=1` , { headers: {'x-happi-key': '722a7e0IiwXrHHM0xoZGRyQ3CTshvgcZ1u4hakRbkOT4zdyqLU3mJD7z' } } )
    .then((res) => res.json())
    .then(checkTitles)
    .catch((err) => { console.log(err);   $(".search-results").html(
      `<h2 class='result-head'>Can't get any results for "${song}." Check spelling or try seatching for something else.</h2>`
   )
    }
    )
   $(".search-results").html(
     `<h2 class='result-head'>Search results for '${song}'</h2>`
  );
}

function showLyrics(id, track, artist) {
  fetch(
    `https://api.happi.dev/v1/music/artists/${id.artist}/albums/${id.album}/tracks/${id.track}/lyrics` , { headers: {'x-happi-key': '722a7e0IiwXrHHM0xoZGRyQ3CTshvgcZ1u4hakRbkOT4zdyqLU3mJD7z' } } 
  )
  .then( (res) => !res.status ? Error("Lyrics not found") : res.json())
   .then( (lyrics) => {
       $(".lyrics").html(
          `<h2><span class='italics'>${track} </span><br/><span class='thin'>By ${artist}</span></h2>
          <div class='centerleft'>${lyrics.result.lyrics ? lyrics.result.lyrics : `The lyrics to <span class='italics'>${track}</span> can't be found. Sorry! Try a different song.`}</div>
          <div class='back-btn'>
            <a href='#target' class='backtoresults'>Back to previous results</a>
          </div>`
        );
        $(".backtoresults").click(() => {
          $(".search-results").show();
          $(".lyrics").empty().hide();
        });
      })
     .catch((err) => {
       $(".lyrics")
         .html(`<p class='api-error'>${err} for <span class='italics'>${track}</span> by ${artist}.</p>
         <p>Choose another selection, or try searching for something else.</p>`);
       $(".back-btn").html(`
         <a href='#target' class='backtoresults'>
           Back to previous results
         </a>`);
       $(".backtoresults").click(() => {
         $(".search-results").show();
         $(".lyrics").empty().hide();
         $(".back-btn").empty();
       });
});
}

 function checkTitles(data) {
   console.log(data)
   //show results again if 'backtoresults' button is clicked
   $(".search-results").show();
   data.result.length ? displayTitles(data) : 
    $(".search-results").append
    ("<h3 class='red'>Can't find any results. <br/>Please check spelling and try again.</h3>");
   }

function displayTitles(data) {
   for (let i = 0; i < data.result.length; i++) {
     let results = data.result[i]
     let artwork = results.cover;
     let songName = results.track;
     let artistName = results.artist;
     let id3 = { idArtist : results.id_artist, idTrack : results.id_track, idAlbum : results.id_album }
    $(`
     <li data-artist=${id3.idArtist} data-album=${id3.idAlbum} id=${id3.idTrack} class='selection' tabindex='0'>
         <img class='albumartwork' src='${artwork}' alt='album artwork'>
         <div class='names'>
           <span class='song-name'>${songName}</span>
           <span class='artist-name'>${artistName}</span>
         </div>
       </li>`).appendTo(".search-results");
   }
   styling(data);
 }

function styling(search) {
  search.result.length >= 28 && $(
    `<div class='line-break'></div><a class='backtotop' href='#target'>Back to the top</a>`
  ).appendTo(".search-results");
  $(".search-box").val("").attr("placeholder", "Search by Artist, or Song.");
  //no hover on mobile screns
  //hover on .selection changes .albumartwork opacity
  if ($(window).width() >= 800) {
    $(".selection")
      .hover(
        (e) => {
          $(e.target).find(".albumartwork").css("opacity", "100%");
          $(e.target).find(".artist-name").css("font-weight", "bold");
        },
        (e) => {
          $(e.target).find(".albumartwork").css("opacity", "50%");
          $(e.target).find(".artist-name").css("font-weight", "normal");
        }
      )
      .focus((e) => $(e.target).find(".albumartwork").css("opacity", "100%"))
      .focusout((e) => $(e.target).find(".albumartwork").css("opacity", "50%"));
  }
}

function checkForLyrics() {
  $(`.search-results`).on("click", ".selection", function () {
    $(".lyrics").show();
    $(".back-btn").show();
    const artistName = $(this).find(".artist-name").text();
    const songName = $(this).find(".song-name").text();
    $(".search-results").hide();
    let happi_id = {
      track: this.id,
      artist: this.getAttribute('data-artist'),
      album: this.getAttribute('data-album')
    }
    showLyrics(happi_id, songName, artistName);
  });
}


$(".search-btn").on("click", (e) => {
  if ($(".search-box").val() != "") {
    e.preventDefault();
    let song = $(".search-box").val();
    $(".search-results, .lyrics").empty();
    searchtrack(song);
  }
});

$(checkForLyrics);
