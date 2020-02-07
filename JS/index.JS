const api = "https://api.spotify.com/v1/search?q=";

/* const tracklist = `${search}&type=track`; 
Client ID aafde63513c44f8c9f558c75a05a6612
Client Secret ad4b9a6c8e6943179a2f6499727cc123

 */



$('.search-btn').on('click', e => {
    e.preventDefault();
    let song = $('.search-box').val();
    $('.search-results').html(`<ul>
        <li>Look what you did!</li>
        <li>${song}</li>
        <li>
        </ul>`);

});