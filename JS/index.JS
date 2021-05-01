"use strict";

//event listener at bottom starts the app
function searchtrack(song) {
  fetch(`https://api.happi.dev/v1/music?q=${song}&limit=50`, { method: "GET", headers: { "x-happi-key" : "722a7e0IiwXrHHM0xoZGRyQ3CTshvgcZ1u4hakRbkOT4zdyqLU3mJD7z" } })
    .then((res) => res.json())
    .then(checkTitles)
    .catch((err) => alert("There seems to be something wrong with the database. Sorry, try another time! Error: " + err));
   $(".search-results").html(
     `<h2 class='result-head'>Search results for '${song}'</h2>`
  );
}

function showLyrics() {
  console.log(target);
  // fetch(
  //   `https://orion.apiseeds.com/api/music/lyric/${artistName}/${songName}?apikey=IMhMN29mkSHK4OfQsxWIUwylijoGFLTduAvZZH5uQR2IAfMVmsbTuXwhdyBuPmch`
  // )
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw Error("Lyrics not found");
  //     }
  //     return response.json();
  //   })
  //   .then((myJson) => {
  //     $(".lyrics").html(
  //       `<h2><span class='italics'>${myJson.result.track.name} </span><br/><span class='thin'>By ${myJson.result.artist.name}</span></h2>
  //       <div class='centerleft'>${myJson.result.track.text}</div>
  //       <div class='back-btn'>
  //         <a href='#target' class='backtoresults'>Back to previous results</a>
  //       </div>`
  //     );
  //     $(".backtoresults").click(() => {
  //       $(".search-results").show();
  //       $(".lyrics").empty().hide();
  //     });
  //   })
  //   .catch((err) => {
  //     $(".lyrics")
  //       .html(`<p class='api-error'>${err} for <span class='italics'>${songName}</span> by ${artistName}.</p>
  //       <p>Choose another selection, or try searching for something else.</p>`);
  //     $(".back-btn").html(`
  //       <a href='#target' class='backtoresults'>
  //         Back to previous results
  //       </a>`);
  //     $(".backtoresults").click(() => {
  //       $(".search-results").show();
  //       $(".lyrics").empty().hide();
  //       $(".back-btn").empty();
  //     });
  //   });
}

 function checkTitles(data) {
   //show results again if 'backtoresults' button is clicked
   $(".search-results").show();
   if (data.result.length) {
     displayTitles(data);
   } else {
     $(".search-results").append(
       "<h3 class='red'>Can't find any results. <br/>Please check spelling and try again.</h3>"
     );
   }
 }

function displayTitles(data) {
  console.log(data.result)
   for (let i = 0; i < data.result.length; i++) {
     let artwork = data.result[i].cover;
     let songName = data.result[i].track;
     let artistName = data.result[i].artist;
     let trackid = data.result[i].id_track
     $(`
     <li class='selection' tabindex='0'>
         <img class='albumartwork' src='${artwork}' alt='album artwork'>
         <div class='names'>
           <span class='song-name'>${songName}</span>
           <span class='artist-name'>${artistName}</span>
         </div>
       </li>`).appendTo(".search-results");
       console.log(trackid);
   }
   styling();
 }

function styling() {
  $(
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
    showLyrics();
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
