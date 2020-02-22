function searchtrack(song) {
  $('.search-results').show();
  fetch(`https://itunes.apple.com/search?term=${song}`, { method: "POST" })
    .then(res => res.json())
    .then(displayTitles)
    .catch(err => alert(err));
}

function displayTitles(data) {
  if ($(".search-box").val()==""){} 
  else if (data.results.length) {
    for (let i = 0; i < data.results.length; i++) {
      let artwork = data.results[i].artworkUrl100;
      let songName = data.results[i].trackName;
      let artistName = data.results[i].artistName;
      $(
        `<a class="selection" href="#">
            <img class="albumartwork" src="${artwork}" alt="album artwork">
            <div class="names">
              <span class="song-name">${songName}</span>
              <span class="artist-name">${artistName}</span>
            </div>
          </a>`
      ).appendTo(".search-results");
    }
    $( ".selection" ).hover((e) => {
        $(e.target).find('.albumartwork').css("opacity", "100%" );
        $(e.target).find('.artist-name').css("opacity", "100%");
      }, (e) => {
        $(e.target).find('.albumartwork').css( "text-decoration", "underline" );
      }
    )
    .focus(e =>$(e.target).find('.albumartwork').css("opacity", "100%" ))
    .focusout(e => $(e.target).find('.albumartwork').css( "opacity", "60%" ));
  } else {
    $(".search-results").append('<h3>Can\'t find any results. <br/>Please check spelling and try again.</h3>');
  }
}

function checkForLyrics() {
  $(`.search-results`).on("click", ".selection", function() {
    $('.search-box').val('').attr('placeholder', 'Search by Artist, or Song.');
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
          `<div class="centerleft">${myJson.result.track.text}</div>
          <div class="backbutton">
            <a href="#target" class="anchor">
              <button class="backtoresults">Back to previous results</button>
            </a>
          </div>`
        );
        $('.backbutton .anchor').click(() => {
          $('.search-results').show();
          $('.lyrics').empty();
        });
      })
      .catch(err => {
        $(".lyrics").html(`<span class="api-error">${err}</span><div><a href="#target"><button class="backtoresults">Back to previous results</button></a></button></div>`)
        $('.backtoresults').click(() => {
          $('.search-results').show();
        });
      });
  });
}

$(".search-btn").on("click", () => {
  if ($('.search-box').val()=="") {}
  else {
    $(".search-results, .lyrics").empty();
    let song = $(".search-box").val();
    searchtrack(song);
  }
});



$(checkForLyrics);
