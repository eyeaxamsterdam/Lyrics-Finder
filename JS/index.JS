function searchtrack(song) {
  fetch(`https://itunes.apple.com/search?term=${song}`, { method: "POST" })
    .then(res => res.json())
    .then(displayTitles)
    .catch(err => alert(err));
}

function displayTitles(data) {
  if (data.results.length) {
    for (let i = 0; i < data.results.length; i++) {
      let songName = data.results[i].trackName;
      let artistName = data.results[i].artistName;
      $(
        `<p class="selection selection-number"><span class="song-name">${songName}</span> - <span class="artist-name">${artistName}</span></p>`
      ).appendTo(".search-results");
    }
  } else {
    $(".search-results").append;
  }
}

function checkForLyrics() {
  $(`.search-results`).on("click", ".selection-number", function() {
    const artistName = $(this)
      .find(".artist-name")
      .text();
    const songName = $(this)
      .find(".song-name")
      .text();

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
        console.log(myJson.result.track.text);
        $(".lyrics").html(
          `<div class="centerleft">${myJson.result.track.text}</div>`
        );
      })
      .catch(err => $(".lyrics").html(`<span class="api-error">${err}</span>`));
  });
}

$(".search-btn").on("click", e => {
  e.preventDefault();
  $(".search-results").empty();
  let song = $(".search-box").val();
  searchtrack(song);
});

$(checkForLyrics);
