
//API Key: AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ

$(document).ready(function() {

  var apiKey = "AIzaSyCg3NJtdbPsGlws9kB0R1GbJsNJdTaYMNQ";

  var video = '';

  $("#searchbar").submit(function(event) {
    event.preventDefault();

    var search = $('#search').val();

    videoSearch(apiKey,search,3);
  })

  function videoSearch(key,search,maxResults) {
    $('#videos').empty();
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search,function(data){
      console.log(data);

  
      data.items.forEach(item => {
        video = `
        <iframe width="420" height="315" src="http://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
        `
        $('#videos').append(video);
      });
    })
  }
})