
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
    $.get('https://www.googleapis.com/youtube/v3/search?key=' + key + '&type=video&part=snippet&maxResults=' + maxResults + '&q=' + search + '&videoEmbeddable=true&videoSyndicated=true&order=relevance&privacyStatus=public&uploadStatus=processed$publicStatsViewable=true',function(data){
      console.log(data);

  
      data.items.forEach(item => {
        video = `
        <iframe id="video" width="420" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allowfullscreen></iframe>
        `
        $('#videos').append(video);
      });
    })
  }
})

var teamSearchInput = document.querySelector('#team-search');
var submitButton = document.querySelector('#searchButton');
var searchResultSection = document.querySelector('.team-serch-results');
var season = document.querySelector('#season');
var  teamSearchInputVal;
let chosenSeason = season.value;
var imageContainer = document.querySelector('.image-container');
var gameStatsSection = document.querySelector('.game-stats');
var gamesList = document.querySelector('#games-list');
  function handleSearch(event) {
    event.preventDefault();
    var teamTitle = document.querySelector('#teamtitle');
    var conference = document.querySelector('#conference');
    var division = document.querySelector('#division');
    var teamsUrl = 'https://www.balldontlie.io/api/v1/teams/';
  teamSearchInputVal = teamSearchInput.value;
    let requestUrl = teamsUrl + teamSearchInputVal;
    if (!teamSearchInputVal) {
        return;
      }

      searchResultSection.classList.remove('hide');
      gameStatsSection.classList.remove('hide');
      

      fetch(requestUrl)
       .then(function (response) {
        return response.json();
       })
       
       .then(function (data) {

       //console.log(data);

    
       teamTitle.textContent = data.full_name;
        conference.textContent = 'Conference: ' + data.conference;
        division.textContent = 'Division: ' + data.division;
        getGames();
        //getRoster();
  });
      
  }

/*
function getRoster() {
    var RosterUrl = `https://www.balldontlie.io/api/v1/players?team_ids[]=${teamSearchInputVal}&seasons[]=${chosenSeason}&per_page=82`;

    fetch(RosterUrl)
    .then(function (response) {
     return response.json();
    })
    .then(function (data){
        console.log(data);
        
            
        
    })
}
*/

  function getGames(){
    var gamesUrl = `https://www.balldontlie.io/api/v1/games
?seasons[]=${chosenSeason}&team_ids[]=${teamSearchInputVal}&per_page=82`;
//console.log(gamesUrl);
    fetch(gamesUrl)
    .then(function (response) {
     return response.json();
    })
    .then(function (data){
        //console.log(data);
        displayScore(data);
        gameStatsSection.classList.remove('hide');
        for (var i = 0; i < data.length; i++) {
            var li = document.createElement('li');
            li.textContent = data[i].home_team_score;
            console.log('hello');
            console.log(data[i].home_team_score);
            //document.body.appendChild(li);
            gamesList.appendChild(li);
            
            
        }
    })
  }

  function displayScore(data){
    console.log(data);
    for (let i = 0; i < data.data.length; i++) {
      var li = document.createElement('li');
      
      var homeTeam = document.createElement('div');
      var awayTeam = document.createElement('div');
      homeTeam.innerText = data.data[i].home_team_score;
      awayTeam.innerText = data.data[i].visitor_team_score;
     
      //li.innerText = data.data[i].home_team_score;
      li.appendChild(homeTeam);
      li.appendChild(awayTeam);
    

      //document.body.appendChild(li);
      gamesList.appendChild(li);
      
      
  }
  }

  submitButton.addEventListener("click", handleSearch);
  
