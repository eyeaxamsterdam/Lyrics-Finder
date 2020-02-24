"use strict";

function searchtrack(song) {
  fetch(`https://itunes.apple.com/search?term=${song}`, { method: "POST" })
    .then(res => res.json())
    .then(displayTitles)
    .catch(err => alert(err));
    $('.search-results').html(`<h2 class="result-head">Search results for "${song}"</h2>`);
}

function displayTitles(data) {
  $('.search-results').show();
  if ($(".search-box").val()==""){} 
  else if (data.results.length) {
    $('.search-box').val('').attr('placeholder', 'Search by Artist, or Song.');
    for (let i = 0; i < data.results.length; i++) {
      let artwork = data.results[i].artworkUrl100;
      let songName = data.results[i].trackName;
      let artistName = data.results[i].artistName;
      $(
        `<a class="selection" href="#result-header">
            <img class="albumartwork" src="${artwork}" alt="album artwork">
            <div class="names">
              <span class="song-name">${songName}</span>
              <span class="artist-name">${artistName}</span>
            </div>
          </a>`
      ).appendTo(".search-results");
    }
    $(`<a class="backtotop" href="#target">back to the top</a>`).appendTo('.search-results');
    if ($(window).width() >= 800) {
      $( ".selection" ).hover((e) => {
        $(e.target).find('.albumartwork').css("opacity", "100%" );
        $(e.target).find('.artist-name').css("opacity", "100%");
      }, (e) => {
        $(e.target).find('.albumartwork').css("opacity", "50%");
        $(e.target).find('.artist-name').css("opacity", "50%")
      }
    )
      .focus(e => $(e.target).find('.albumartwork').css("opacity", "100%" ))
      .focusout(e => $(e.target).find('.albumartwork').css( "opacity", "50%" ));
    }
    else {}
  } 
  else {
    $(".search-results").append('<h3 class="red">Can\'t find any results. <br/>Please check spelling and try again.</h3>');
  }
}

function checkForLyrics() {
  $(`.search-results`).on("click", ".selection", function() {
    $('.lyrics').show();
    const artistName = $(this)
      .find(".artist-name")
      .text();
    const songName = $(this)
      .find(".song-name")
      .text();
    $('.search-results').hide();
    fetch(
      `https://orion.apiseeds.com/api/music/lyric/${artistName}/${songName}?apikey=IMhMN29mkSHK4OfQsxWIUwylijoGFLTduAvZZH5uQR2IAfMVmsbTuXwhdyBuPmch`
    )
      .then(response => {
        if (!response.ok) {
          throw Error("Lyrics not found");
        }
        return response.json();
      })
      .then(myJson => {
        $(".lyrics").html(
          `<h2><span class='italics'>${myJson.result.track.name} </span>By ${myJson.result.artist.name}</h2>
          <div class="centerleft">${myJson.result.track.text}</div>
            <a href="#target" class="anchor">
              <button class="backtoresults">Back to previous results</button>
            </a>`
        );
        $('.backtoresults, .anchor').click(() => {
          $('.search-results').show();
          $('.lyrics').empty();
        });
      })
      .catch(err => {
        $(".lyrics").html(`<p class="api-error">${err} for <span class="italics">${songName}</span> by ${artistName}.</p><p>Try another selection.</p><a href="#target"><button class="backtoresults">Back to previous results</button></a></button>`)
        $('.backtoresults').click(() => {
          $('.search-results').show();
        });
      });
      /* $("html, body").animate({ scrollTop: $("#result-header").scrollTop() }, 1000); */     
  });
}

$(".search-btn").on("click", () => {
  if ($('.search-box').val()=="") {}
  else {
    let song = $(".search-box").val();
    $(".search-results, .lyrics").empty();
    searchtrack(song);
  }
});

$(checkForLyrics);