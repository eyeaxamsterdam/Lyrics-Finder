'use strict';

//event listener at bottom starts the app
function searchtrack(song) {
  fetch(`https://itunes.apple.com/search?term=${song}`, { method: 'POST' })
    .then(res => res.json())
    .then(checkTitles)
    .catch(err => alert(err));
    $('.search-results').html(`<h2 class='result-head'>Search results for '${song}'</h2>`);
}

function checkTitles(data) {
  //show results again if 'backtoresults' button is clicked
  $('.search-results').show();
  if (data.results.length) {
    displayTitles(data);
  }
  else {
    $('.search-results').append("<h3 class='red'>Can't find any results. <br/>Please check spelling and try again.</h3>");
  }
}

function displayTitles(data) {
  for (let i = 0; i < data.results.length; i++) {
    let artwork = data.results[i].artworkUrl100;
    let songName = data.results[i].trackName;
    let artistName = data.results[i].artistName;
    $(`
    <li class='selection' tabindex='0'>
        <img class='albumartwork' src='${artwork}' alt='album artwork'>
        <div class='names'>
          <span class='song-name'>${songName}</span>
          <span class='artist-name'>${artistName}</span>
        </div>
      </li>`)
      .appendTo('.search-results'
    );
  }
  styling();
}

function styling() {
  $(`<div class='line-break'></div><a class='backtotop' href='#target'>Back to the top</a>`).appendTo('.search-results');
  $('.search-box').val('').attr('placeholder', 'Search by Artist, or Song.');
  //no hover on mobile screns
  if ($(window).width() >= 800) {
    $( '.selection' ).hover((e) => {
      $(e.target).find('.albumartwork').css('opacity', '100%' );
      $(e.target).find('.artist-name').css('font-weight', 'bold');
    }, (e) => {
      $(e.target).find('.albumartwork').css('opacity', '50%');
      $(e.target).find('.artist-name').css('font-weight', 'normal')
    }
  ) 
  .focus(e => $(e.target).find('.albumartwork').css('opacity', '100%' ))
  .focusout(e => $(e.target).find('.albumartwork').css( 'opacity', '50%' ));
  }
} 


function checkForLyrics() {
  $(`.search-results`).on('click', '.selection', function() {
    $('.lyrics').show();
    $('.back-btn').show();
    const artistName = $(this).find('.artist-name').text();
    const songName = $(this).find('.song-name').text();
    $('.search-results').hide();
    fetch(
      `https://orion.apiseeds.com/api/music/lyric/${artistName}/${songName}?apikey=IMhMN29mkSHK4OfQsxWIUwylijoGFLTduAvZZH5uQR2IAfMVmsbTuXwhdyBuPmch`
    )
      .then(response => {
        if (!response.ok) {
          throw Error('Lyrics not found');
        }
        return response.json();
      })
      .then(myJson => {
        $('.lyrics').html(
          `<h2><span class='italics'>${myJson.result.track.name} </span><br/><span class='thin'>By ${myJson.result.artist.name}</span></h2>
          <div class='centerleft'>${myJson.result.track.text}</div>
          <div class='back-btn'>
            <a href='#target' class='backtoresults'>Back to previous results</a>
          </div>`
        );
        $('.backtoresults').click(() => {
          $('.search-results').show();
          $('.lyrics').empty().hide();
        });
      })
      .catch(err => {
        $('.lyrics').html(`<p class='api-error'>${err} for <span class='italics'>${songName}</span> by ${artistName}.</p>
          <p>Choose another selection, or try searching for something else.</p>`);
        $('.back-btn').html(`
          <a href='#target' class='backtoresults'>
            Back to previous results
          </a>`);        
        $('.backtoresults').click(() => {
          $('.search-results').show();
          $('.lyrics').empty().hide();
          $('.back-btn').empty();
        });
      });  
  });
}


$('.search-btn').on('click', (e) => {
  if ($('.search-box').val()!='') {
    e.preventDefault();
    let song = $('.search-box').val();
    $('.search-results, .lyrics').empty();
    searchtrack(song);
  }
});


$(checkForLyrics);